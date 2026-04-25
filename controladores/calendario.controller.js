import { google } from 'googleapis';
import { User } from '../modelos/relations.js';
import { encrypt } from '../utils/encrypt.js';
import { decrypt } from '../utils/decrypt.js';
import {
    FRONTEND_URL,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
} from '../config/config.js';

const makeOAuth2 = () =>
    new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URI
    );

const getAuthClient = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User no encontrado');
    if (!user.google_token) throw new Error('Google Calendar no vinculado');

    const oauth2 = makeOAuth2();
    oauth2.setCredentials({ refresh_token: decrypt(user.google_token) });
    return oauth2;
};

export const startOAuth = (req, res) => {
    const { userId } = req.query;
    if (!userId)
        return res.status(400).json({ error: 'userId requerido' });

    const oauth2 = makeOAuth2();
    const authUrl = oauth2.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar'],
        prompt: 'consent',
        state: userId,
    });

    res.redirect(authUrl);
};

export const handleOAuthCallback = async (req, res) => {
    try {
        const { code, state: userId } = req.query;

        const oauth2 = makeOAuth2();
        const { tokens } = await oauth2.getToken(code);
        const refreshToken = tokens.refresh_token;

        await User.update(
            { google_token: encrypt(refreshToken) },
            { where: { id: userId } }
        );

        res.redirect(
            `${FRONTEND_URL ?? 'http://localhost:5173'}/calendario?linked=true`
        );
    } catch (err) {
        console.error('[handleOAuthCallback]', err);
        res.redirect(
            `${FRONTEND_URL ?? 'http://localhost:5173'}/calendario?linked=false`
        );
    }
};

export const unlinkGoogleCalendar = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId)
            return res.status(400).json({ error: 'userId requerido' });

        await User.update(
            { google_token: null },
            { where: { id: userId } }
        );

        res.status(200).json({ ok: true, mensaje: 'Google Calendar desvinculado' });
    } catch (err) {
        console.error('[unlinkGoogleCalendar]', err);
        res.status(500).json({ error: err.message });
    }
};

export const getCalendarStatus = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId, {
            attributes: ['id', 'nombre', 'google_token'],
        });
        if (!user)
            return res.status(404).json({ error: 'User no encontrado' });

        res.status(200).json({ ok: true, linked: !!user.google_token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const listarEventos = async (req, res) => {
    try {
        const { userId } = req.params;
        const {
            timeMin = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
            timeMax = new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0).toISOString(),
        } = req.query;

        const oauth2 = await getAuthClient(userId);
        const calendar = google.calendar({ version: 'v3', auth: oauth2 });

        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin,
            timeMax,
            singleEvents: true,
            orderBy: 'startTime',
            maxResults: 250,
        });

        res.status(200).json({ ok: true, data: response.data.items });
    } catch (err) {
        console.error('[listarEventos]', err);
        if (err.message.includes('invalid_grant'))
            return res.status(401).json({ error: 'Reautenticación requerida' });
        res.status(500).json({ error: err.message });
    }
};

export const crearEvento = async (req, res) => {
    try {
        const {
            userId, titulo, descripcion,
            fechaInicio, fechaFin, color,
        } = req.body;

        if (!userId || !titulo || !fechaInicio || !fechaFin)
            return res.status(400).json({ error: 'Faltan campos requeridos' });

        const oauth2 = await getAuthClient(userId);
        const calendar = google.calendar({ version: 'v3', auth: oauth2 });

        const event = {
            summary: titulo,
            description: descripcion || '',
            start: { dateTime: fechaInicio, timeZone: 'America/Guayaquil' },
            end: { dateTime: fechaFin, timeZone: 'America/Guayaquil' },
            colorId: color ?? '1',
        };

        const busy = await calendar.freebusy.query({
            requestBody: {
                timeMin: fechaInicio,
                timeMax: fechaFin,
                items: [{ id: 'primary' }],
            },
        });

        if (busy.data.calendars.primary.busy?.length > 0)
            return res.status(409).json({ error: 'El horario ya está ocupado' });

        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
        });

        res.status(201).json({ ok: true, data: response.data });
    } catch (err) {
        console.error('[crearEvento]', err);
        if (err.message.includes('invalid_grant'))
            return res.status(401).json({ error: 'Reautenticación requerida' });
        res.status(500).json({ error: err.message });
    }
};

export const actualizarEvento = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { userId, titulo, descripcion, fechaInicio, fechaFin, color } = req.body;

        if (!userId || !eventId)
            return res.status(400).json({ error: 'Faltan campos requeridos' });

        const oauth2 = await getAuthClient(userId);
        const calendar = google.calendar({ version: 'v3', auth: oauth2 });

        const updated = {
            summary: titulo,
            description: descripcion || '',
            start: { dateTime: fechaInicio, timeZone: 'America/Guayaquil' },
            end: { dateTime: fechaFin, timeZone: 'America/Guayaquil' },
            colorId: color ?? '1',
        };

        await calendar.events.update({
            calendarId: 'primary',
            eventId,
            requestBody: updated,
        });

        res.status(200).json({ ok: true, mensaje: 'Evento actualizado' });
    } catch (err) {
        console.error('[actualizarEvento]', err);
        res.status(500).json({ error: err.message });
    }
};

export const eliminarEvento = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { userId } = req.body;

        if (!userId || !eventId)
            return res.status(400).json({ error: 'Faltan campos requeridos' });

        const oauth2 = await getAuthClient(userId);
        const calendar = google.calendar({ version: 'v3', auth: oauth2 });

        await calendar.events.delete({
            calendarId: 'primary',
            eventId,
        });

        res.status(200).json({ ok: true, mensaje: 'Evento eliminado' });
    } catch (err) {
        console.error('[eliminarEvento]', err);
        res.status(500).json({ error: err.message });
    }
};