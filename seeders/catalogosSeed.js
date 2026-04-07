import { Pais, Ciudad, Rubro, Estados } from "../modelos/relations.js";

// ══════════════════════════════════════════════════════════════
// DATOS
// ══════════════════════════════════════════════════════════════
const ESTADOS = [
  { nombre: "Lead" },
  { nombre: "Contactado" },
  { nombre: "Levantamiento" },
  { nombre: "Estimacion" },
  { nombre: "Propuesta" },
  { nombre: "En Aprobacion" },
  { nombre: "Aprobado" },
  { nombre: "Rechazado" },
  { nombre: "En Ejecución" },
  { nombre: "Cerrado" },
  { nombre: "Stand BY" },
  { nombre: "Facturada" },
  { nombre: "Activo" },
  { nombre: "Inactivo" },
  { nombre: "Pendiente" },
];
const PAISES = [
  // América del Sur
  { id: 1, nombre: "Argentina", codigo_iso: "ARG" },
  { id: 2, nombre: "Bolivia", codigo_iso: "BOL" },
  { id: 3, nombre: "Brasil", codigo_iso: "BRA" },
  { id: 4, nombre: "Chile", codigo_iso: "CHL" },
  { id: 5, nombre: "Colombia", codigo_iso: "COL" },
  { id: 6, nombre: "Ecuador", codigo_iso: "ECU" },
  { id: 7, nombre: "Paraguay", codigo_iso: "PRY" },
  { id: 8, nombre: "Perú", codigo_iso: "PER" },
  { id: 9, nombre: "Uruguay", codigo_iso: "URY" },
  { id: 10, nombre: "Venezuela", codigo_iso: "VEN" },
  { id: 11, nombre: "Guyana", codigo_iso: "GUY" },
  { id: 12, nombre: "Surinam", codigo_iso: "SUR" },
  // América Central y el Caribe
  { id: 13, nombre: "Costa Rica", codigo_iso: "CRI" },
  { id: 14, nombre: "Cuba", codigo_iso: "CUB" },
  { id: 15, nombre: "El Salvador", codigo_iso: "SLV" },
  { id: 16, nombre: "Guatemala", codigo_iso: "GTM" },
  { id: 17, nombre: "Honduras", codigo_iso: "HND" },
  { id: 18, nombre: "México", codigo_iso: "MEX" },
  { id: 19, nombre: "Nicaragua", codigo_iso: "NIC" },
  { id: 20, nombre: "Panamá", codigo_iso: "PAN" },
  { id: 21, nombre: "República Dominicana", codigo_iso: "DOM" },
  { id: 22, nombre: "Puerto Rico", codigo_iso: "PRI" },
  { id: 23, nombre: "Jamaica", codigo_iso: "JAM" },
  { id: 24, nombre: "Haití", codigo_iso: "HTI" },
  // América del Norte
  { id: 25, nombre: "Estados Unidos", codigo_iso: "USA" },
  { id: 26, nombre: "Canadá", codigo_iso: "CAN" },
  // Europa
  { id: 27, nombre: "España", codigo_iso: "ESP" },
  { id: 28, nombre: "Portugal", codigo_iso: "PRT" },
  { id: 29, nombre: "Francia", codigo_iso: "FRA" },
  { id: 30, nombre: "Alemania", codigo_iso: "DEU" },
  { id: 31, nombre: "Reino Unido", codigo_iso: "GBR" },
  { id: 32, nombre: "Italia", codigo_iso: "ITA" },
  { id: 33, nombre: "Países Bajos", codigo_iso: "NLD" },
  { id: 34, nombre: "Suiza", codigo_iso: "CHE" },
  // Resto del mundo (relevante para negocios)
  { id: 35, nombre: "China", codigo_iso: "CHN" },
  { id: 36, nombre: "India", codigo_iso: "IND" },
  { id: 37, nombre: "Japón", codigo_iso: "JPN" },
  { id: 38, nombre: "Emiratos Árabes Unidos", codigo_iso: "ARE" },
  { id: 39, nombre: "Australia", codigo_iso: "AUS" },
  { id: 40, nombre: "Otro", codigo_iso: "OTR" },
];

const CIUDADES = [
  // ── Argentina (1) ─────────────────────────────────────────
  { id: 1, pais_id: 1, nombre: "Buenos Aires" },
  { id: 2, pais_id: 1, nombre: "Córdoba" },
  { id: 3, pais_id: 1, nombre: "Rosario" },
  { id: 4, pais_id: 1, nombre: "Mendoza" },
  { id: 5, pais_id: 1, nombre: "La Plata" },
  { id: 6, pais_id: 1, nombre: "San Miguel de Tucumán" },
  { id: 7, pais_id: 1, nombre: "Mar del Plata" },
  { id: 8, pais_id: 1, nombre: "Salta" },
  { id: 9, pais_id: 1, nombre: "Santa Fe" },
  { id: 10, pais_id: 1, nombre: "San Juan" },

  // ── Bolivia (2) ───────────────────────────────────────────
  { id: 11, pais_id: 2, nombre: "La Paz" },
  { id: 12, pais_id: 2, nombre: "Santa Cruz de la Sierra" },
  { id: 13, pais_id: 2, nombre: "Cochabamba" },
  { id: 14, pais_id: 2, nombre: "Oruro" },
  { id: 15, pais_id: 2, nombre: "Sucre" },
  { id: 16, pais_id: 2, nombre: "Potosí" },
  { id: 17, pais_id: 2, nombre: "Tarija" },

  // ── Brasil (3) ────────────────────────────────────────────
  { id: 18, pais_id: 3, nombre: "São Paulo" },
  { id: 19, pais_id: 3, nombre: "Río de Janeiro" },
  { id: 20, pais_id: 3, nombre: "Brasilia" },
  { id: 21, pais_id: 3, nombre: "Belo Horizonte" },
  { id: 22, pais_id: 3, nombre: "Porto Alegre" },
  { id: 23, pais_id: 3, nombre: "Salvador" },
  { id: 24, pais_id: 3, nombre: "Fortaleza" },
  { id: 25, pais_id: 3, nombre: "Recife" },
  { id: 26, pais_id: 3, nombre: "Manaus" },
  { id: 27, pais_id: 3, nombre: "Curitiba" },

  // ── Chile (4) ─────────────────────────────────────────────
  { id: 28, pais_id: 4, nombre: "Santiago" },
  { id: 29, pais_id: 4, nombre: "Valparaíso" },
  { id: 30, pais_id: 4, nombre: "Concepción" },
  { id: 31, pais_id: 4, nombre: "Antofagasta" },
  { id: 32, pais_id: 4, nombre: "La Serena" },
  { id: 33, pais_id: 4, nombre: "Temuco" },
  { id: 34, pais_id: 4, nombre: "Iquique" },
  { id: 35, pais_id: 4, nombre: "Puerto Montt" },

  // ── Colombia (5) ──────────────────────────────────────────
  { id: 36, pais_id: 5, nombre: "Bogotá" },
  { id: 37, pais_id: 5, nombre: "Medellín" },
  { id: 38, pais_id: 5, nombre: "Cali" },
  { id: 39, pais_id: 5, nombre: "Barranquilla" },
  { id: 40, pais_id: 5, nombre: "Cartagena" },
  { id: 41, pais_id: 5, nombre: "Bucaramanga" },
  { id: 42, pais_id: 5, nombre: "Pereira" },
  { id: 43, pais_id: 5, nombre: "Cúcuta" },
  { id: 44, pais_id: 5, nombre: "Manizales" },
  { id: 45, pais_id: 5, nombre: "Santa Marta" },

  // ── Ecuador (6) ───────────────────────────────────────────
  { id: 46, pais_id: 6, nombre: "Quito" },
  { id: 47, pais_id: 6, nombre: "Guayaquil" },
  { id: 48, pais_id: 6, nombre: "Cuenca" },
  { id: 49, pais_id: 6, nombre: "Ambato" },
  { id: 50, pais_id: 6, nombre: "Manta" },
  { id: 51, pais_id: 6, nombre: "Loja" },
  { id: 52, pais_id: 6, nombre: "Santo Domingo" },
  { id: 53, pais_id: 6, nombre: "Machala" },
  { id: 54, pais_id: 6, nombre: "Esmeraldas" },
  { id: 55, pais_id: 6, nombre: "Ibarra" },
  { id: 56, pais_id: 6, nombre: "Riobamba" },
  { id: 57, pais_id: 6, nombre: "Portoviejo" },
  { id: 58, pais_id: 6, nombre: "Babahoyo" },

  // ── Paraguay (7) ──────────────────────────────────────────
  { id: 59, pais_id: 7, nombre: "Asunción" },
  { id: 60, pais_id: 7, nombre: "Ciudad del Este" },
  { id: 61, pais_id: 7, nombre: "Encarnación" },
  { id: 62, pais_id: 7, nombre: "San Lorenzo" },
  { id: 63, pais_id: 7, nombre: "Lambaré" },

  // ── Perú (8) ──────────────────────────────────────────────
  { id: 64, pais_id: 8, nombre: "Lima" },
  { id: 65, pais_id: 8, nombre: "Arequipa" },
  { id: 66, pais_id: 8, nombre: "Trujillo" },
  { id: 67, pais_id: 8, nombre: "Chiclayo" },
  { id: 68, pais_id: 8, nombre: "Piura" },
  { id: 69, pais_id: 8, nombre: "Iquitos" },
  { id: 70, pais_id: 8, nombre: "Cusco" },
  { id: 71, pais_id: 8, nombre: "Huancayo" },
  { id: 72, pais_id: 8, nombre: "Tacna" },

  // ── Uruguay (9) ───────────────────────────────────────────
  { id: 73, pais_id: 9, nombre: "Montevideo" },
  { id: 74, pais_id: 9, nombre: "Salto" },
  { id: 75, pais_id: 9, nombre: "Paysandú" },
  { id: 76, pais_id: 9, nombre: "Las Piedras" },
  { id: 77, pais_id: 9, nombre: "Rivera" },

  // ── Venezuela (10) ────────────────────────────────────────
  { id: 78, pais_id: 10, nombre: "Caracas" },
  { id: 79, pais_id: 10, nombre: "Maracaibo" },
  { id: 80, pais_id: 10, nombre: "Valencia" },
  { id: 81, pais_id: 10, nombre: "Barquisimeto" },
  { id: 82, pais_id: 10, nombre: "Maracay" },
  { id: 83, pais_id: 10, nombre: "Ciudad Guayana" },

  // ── Guyana (11) ───────────────────────────────────────────
  { id: 84, pais_id: 11, nombre: "Georgetown" },

  // ── Surinam (12) ──────────────────────────────────────────
  { id: 85, pais_id: 12, nombre: "Paramaribo" },

  // ── Costa Rica (13) ───────────────────────────────────────
  { id: 86, pais_id: 13, nombre: "San José" },
  { id: 87, pais_id: 13, nombre: "Alajuela" },
  { id: 88, pais_id: 13, nombre: "Cartago" },
  { id: 89, pais_id: 13, nombre: "Heredia" },
  { id: 90, pais_id: 13, nombre: "Liberia" },

  // ── Cuba (14) ─────────────────────────────────────────────
  { id: 91, pais_id: 14, nombre: "La Habana" },
  { id: 92, pais_id: 14, nombre: "Santiago de Cuba" },
  { id: 93, pais_id: 14, nombre: "Camagüey" },
  { id: 94, pais_id: 14, nombre: "Holguín" },

  // ── El Salvador (15) ──────────────────────────────────────
  { id: 95, pais_id: 15, nombre: "San Salvador" },
  { id: 96, pais_id: 15, nombre: "Santa Ana" },
  { id: 97, pais_id: 15, nombre: "San Miguel" },
  { id: 98, pais_id: 15, nombre: "Soyapango" },

  // ── Guatemala (16) ────────────────────────────────────────
  { id: 99, pais_id: 16, nombre: "Ciudad de Guatemala" },
  { id: 100, pais_id: 16, nombre: "Quetzaltenango" },
  { id: 101, pais_id: 16, nombre: "Escuintla" },
  { id: 102, pais_id: 16, nombre: "Villa Nueva" },

  // ── Honduras (17) ─────────────────────────────────────────
  { id: 103, pais_id: 17, nombre: "Tegucigalpa" },
  { id: 104, pais_id: 17, nombre: "San Pedro Sula" },
  { id: 105, pais_id: 17, nombre: "La Ceiba" },
  { id: 106, pais_id: 17, nombre: "Choloma" },

  // ── México (18) ───────────────────────────────────────────
  { id: 107, pais_id: 18, nombre: "Ciudad de México" },
  { id: 108, pais_id: 18, nombre: "Guadalajara" },
  { id: 109, pais_id: 18, nombre: "Monterrey" },
  { id: 110, pais_id: 18, nombre: "Puebla" },
  { id: 111, pais_id: 18, nombre: "Tijuana" },
  { id: 112, pais_id: 18, nombre: "León" },
  { id: 113, pais_id: 18, nombre: "Juárez" },
  { id: 114, pais_id: 18, nombre: "Mérida" },
  { id: 115, pais_id: 18, nombre: "Cancún" },
  { id: 116, pais_id: 18, nombre: "Querétaro" },
  { id: 117, pais_id: 18, nombre: "San Luis Potosí" },
  { id: 118, pais_id: 18, nombre: "Hermosillo" },

  // ── Nicaragua (19) ────────────────────────────────────────
  { id: 119, pais_id: 19, nombre: "Managua" },
  { id: 120, pais_id: 19, nombre: "León" },
  { id: 121, pais_id: 19, nombre: "Masaya" },
  { id: 122, pais_id: 19, nombre: "Granada" },

  // ── Panamá (20) ───────────────────────────────────────────
  { id: 123, pais_id: 20, nombre: "Ciudad de Panamá" },
  { id: 124, pais_id: 20, nombre: "Colón" },
  { id: 125, pais_id: 20, nombre: "David" },
  { id: 126, pais_id: 20, nombre: "La Chorrera" },

  // ── República Dominicana (21) ─────────────────────────────
  { id: 127, pais_id: 21, nombre: "Santo Domingo" },
  { id: 128, pais_id: 21, nombre: "Santiago de los Caballeros" },
  { id: 129, pais_id: 21, nombre: "La Romana" },
  { id: 130, pais_id: 21, nombre: "San Pedro de Macorís" },

  // ── Puerto Rico (22) ──────────────────────────────────────
  { id: 131, pais_id: 22, nombre: "San Juan" },
  { id: 132, pais_id: 22, nombre: "Bayamón" },
  { id: 133, pais_id: 22, nombre: "Carolina" },
  { id: 134, pais_id: 22, nombre: "Ponce" },

  // ── Jamaica (23) ──────────────────────────────────────────
  { id: 135, pais_id: 23, nombre: "Kingston" },
  { id: 136, pais_id: 23, nombre: "Montego Bay" },

  // ── Haití (24) ────────────────────────────────────────────
  { id: 137, pais_id: 24, nombre: "Puerto Príncipe" },
  { id: 138, pais_id: 24, nombre: "Cap-Haïtien" },

  // ── Estados Unidos (25) ───────────────────────────────────
  { id: 139, pais_id: 25, nombre: "Nueva York" },
  { id: 140, pais_id: 25, nombre: "Los Ángeles" },
  { id: 141, pais_id: 25, nombre: "Miami" },
  { id: 142, pais_id: 25, nombre: "Chicago" },
  { id: 143, pais_id: 25, nombre: "Houston" },
  { id: 144, pais_id: 25, nombre: "Dallas" },
  { id: 145, pais_id: 25, nombre: "San Francisco" },
  { id: 146, pais_id: 25, nombre: "Seattle" },
  { id: 147, pais_id: 25, nombre: "Boston" },
  { id: 148, pais_id: 25, nombre: "Atlanta" },
  { id: 149, pais_id: 25, nombre: "Washington D.C." },
  { id: 150, pais_id: 25, nombre: "Phoenix" },
  { id: 151, pais_id: 25, nombre: "San Diego" },
  { id: 152, pais_id: 25, nombre: "Denver" },

  // ── Canadá (26) ───────────────────────────────────────────
  { id: 153, pais_id: 26, nombre: "Toronto" },
  { id: 154, pais_id: 26, nombre: "Vancouver" },
  { id: 155, pais_id: 26, nombre: "Montreal" },
  { id: 156, pais_id: 26, nombre: "Calgary" },
  { id: 157, pais_id: 26, nombre: "Ottawa" },
  { id: 158, pais_id: 26, nombre: "Edmonton" },

  // ── España (27) ───────────────────────────────────────────
  { id: 159, pais_id: 27, nombre: "Madrid" },
  { id: 160, pais_id: 27, nombre: "Barcelona" },
  { id: 161, pais_id: 27, nombre: "Valencia" },
  { id: 162, pais_id: 27, nombre: "Sevilla" },
  { id: 163, pais_id: 27, nombre: "Bilbao" },
  { id: 164, pais_id: 27, nombre: "Málaga" },
  { id: 165, pais_id: 27, nombre: "Zaragoza" },
  { id: 166, pais_id: 27, nombre: "Murcia" },

  // ── Portugal (28) ─────────────────────────────────────────
  { id: 167, pais_id: 28, nombre: "Lisboa" },
  { id: 168, pais_id: 28, nombre: "Porto" },
  { id: 169, pais_id: 28, nombre: "Braga" },

  // ── Francia (29) ──────────────────────────────────────────
  { id: 170, pais_id: 29, nombre: "París" },
  { id: 171, pais_id: 29, nombre: "Lyon" },
  { id: 172, pais_id: 29, nombre: "Marsella" },

  // ── Alemania (30) ─────────────────────────────────────────
  { id: 173, pais_id: 30, nombre: "Berlín" },
  { id: 174, pais_id: 30, nombre: "Múnich" },
  { id: 175, pais_id: 30, nombre: "Hamburgo" },
  { id: 176, pais_id: 30, nombre: "Frankfurt" },

  // ── Reino Unido (31) ──────────────────────────────────────
  { id: 177, pais_id: 31, nombre: "Londres" },
  { id: 178, pais_id: 31, nombre: "Manchester" },
  { id: 179, pais_id: 31, nombre: "Birmingham" },

  // ── Italia (32) ───────────────────────────────────────────
  { id: 180, pais_id: 32, nombre: "Roma" },
  { id: 181, pais_id: 32, nombre: "Milán" },
  { id: 182, pais_id: 32, nombre: "Nápoles" },

  // ── Países Bajos (33) ─────────────────────────────────────
  { id: 183, pais_id: 33, nombre: "Ámsterdam" },
  { id: 184, pais_id: 33, nombre: "Rotterdam" },
  { id: 185, pais_id: 33, nombre: "La Haya" },

  // ── Suiza (34) ────────────────────────────────────────────
  { id: 186, pais_id: 34, nombre: "Zúrich" },
  { id: 187, pais_id: 34, nombre: "Ginebra" },
  { id: 188, pais_id: 34, nombre: "Berna" },

  // ── China (35) ────────────────────────────────────────────
  { id: 189, pais_id: 35, nombre: "Pekín" },
  { id: 190, pais_id: 35, nombre: "Shanghái" },
  { id: 191, pais_id: 35, nombre: "Shenzhen" },
  { id: 192, pais_id: 35, nombre: "Guangzhou" },

  // ── India (36) ────────────────────────────────────────────
  { id: 193, pais_id: 36, nombre: "Mumbai" },
  { id: 194, pais_id: 36, nombre: "Bangalore" },
  { id: 195, pais_id: 36, nombre: "Nueva Delhi" },
  { id: 196, pais_id: 36, nombre: "Chennai" },

  // ── Japón (37) ────────────────────────────────────────────
  { id: 197, pais_id: 37, nombre: "Tokio" },
  { id: 198, pais_id: 37, nombre: "Osaka" },
  { id: 199, pais_id: 37, nombre: "Yokohama" },

  // ── Emiratos Árabes (38) ──────────────────────────────────
  { id: 200, pais_id: 38, nombre: "Dubái" },
  { id: 201, pais_id: 38, nombre: "Abu Dabi" },

  // ── Australia (39) ────────────────────────────────────────
  { id: 202, pais_id: 39, nombre: "Sídney" },
  { id: 203, pais_id: 39, nombre: "Melbourne" },
  { id: 204, pais_id: 39, nombre: "Brisbane" },

  // ── Otro (40) ─────────────────────────────────────────────
  { id: 205, pais_id: 40, nombre: "Otra ciudad" },
];

const RUBROS = [
  // ── Tecnología ────────────────────────────────────────────
  { id: 1, nombre: "Tecnología e Informática", descripcion: "Software, hardware, telecomunicaciones y servicios TI" },
  { id: 2, nombre: "Desarrollo de Software", descripcion: "Empresas de desarrollo de aplicaciones web, móviles y sistemas" },
  { id: 3, nombre: "Ciberseguridad", descripcion: "Seguridad informática, protección de datos y auditoría digital" },
  { id: 4, nombre: "Inteligencia Artificial y Data", descripcion: "IA, machine learning, big data, analítica y ciencia de datos" },
  { id: 5, nombre: "Cloud e Infraestructura", descripcion: "Servicios en la nube, DevOps, hosting y gestión de infraestructura" },
  { id: 6, nombre: "E-commerce y Marketplaces", descripcion: "Plataformas de comercio electrónico y mercados digitales" },
  // ── Finanzas ──────────────────────────────────────────────
  { id: 7, nombre: "Banca y Servicios Financieros", descripcion: "Bancos, aseguradoras, fondos de inversión y fintech" },
  { id: 8, nombre: "Fintech", descripcion: "Pagos digitales, cripto, neobancos y tecnología financiera" },
  { id: 9, nombre: "Seguros", descripcion: "Aseguradoras, reaseguradoras y corredores de seguros" },
  { id: 10, nombre: "Gestión de Inversiones", descripcion: "Fondos, portafolios, family offices y asset management" },
  { id: 11, nombre: "Contabilidad y Auditoría", descripcion: "Firmas contables, auditorías externas y servicios fiscales" },
  // ── Salud ─────────────────────────────────────────────────
  { id: 12, nombre: "Salud y Farmacéutica", descripcion: "Hospitales, clínicas, laboratorios y farmacéuticas" },
  { id: 13, nombre: "Biotecnología y Ciencias de la Vida", descripcion: "Investigación biomédica, genómica y dispositivos médicos" },
  { id: 14, nombre: "Salud Digital y Telemedicina", descripcion: "Plataformas de telemedicina, apps de salud y HIS/EHR" },
  { id: 15, nombre: "Bienestar y Fitness", descripcion: "Gimnasios, nutrición, wellness corporativo y spas" },
  // ── Educación ─────────────────────────────────────────────
  { id: 16, nombre: "Educación", descripcion: "Colegios, universidades, institutos y formación técnica" },
  { id: 17, nombre: "Educación en Línea y EdTech", descripcion: "Plataformas LMS, MOOCs, capacitación corporativa digital" },
  // ── Retail y Consumo ──────────────────────────────────────
  { id: 18, nombre: "Retail y Comercio", descripcion: "Tiendas, supermercados, e-commerce y distribución" },
  { id: 19, nombre: "Alimentos y Bebidas", descripcion: "Producción, distribución y retail de alimentos" },
  { id: 20, nombre: "Moda y Textil", descripcion: "Confección, diseño, calzado y accesorios" },
  { id: 21, nombre: "Cosmética y Cuidado Personal", descripcion: "Belleza, cosméticos, higiene y cuidado del hogar" },
  { id: 22, nombre: "Productos de Lujo", descripcion: "Joyería, relojes, artículos premium y marcas de lujo" },
  // ── Industria y Manufactura ───────────────────────────────
  { id: 23, nombre: "Manufactura e Industria", descripcion: "Fabricación, ensamblaje y producción industrial" },
  { id: 24, nombre: "Automotriz", descripcion: "Fabricantes, concesionarios y servicios automotrices" },
  { id: 25, nombre: "Aeroespacial y Defensa", descripcion: "Aviación, aeronáutica, defensa y equipamiento militar" },
  { id: 26, nombre: "Química y Petroquímica", descripcion: "Industria química, plásticos, fertilizantes y derivados" },
  { id: 27, nombre: "Minería y Metales", descripcion: "Extracción minera, metalurgia y procesamiento de minerales" },
  // ── Energía ───────────────────────────────────────────────
  { id: 28, nombre: "Energía y Utilities", descripcion: "Electricidad, gas, agua, petróleo y renovables" },
  { id: 29, nombre: "Energías Renovables", descripcion: "Solar, eólica, hidroeléctrica y almacenamiento de energía" },
  { id: 30, nombre: "Petróleo y Gas", descripcion: "Exploración, extracción, refinación y distribución de hidrocarburos" },
  // ── Construcción e Inmobiliario ───────────────────────────
  { id: 31, nombre: "Construcción e Inmobiliario", descripcion: "Constructoras, inmobiliarias y gestión de activos" },
  { id: 32, nombre: "Arquitectura e Ingeniería", descripcion: "Diseño arquitectónico, ingeniería civil y consultoría de proyectos" },
  { id: 33, nombre: "Facilities y Gestión de Espacios", descripcion: "Administración de edificios, coworking y property management" },
  // ── Logística y Transporte ────────────────────────────────
  { id: 34, nombre: "Transporte y Logística", descripcion: "Carga, courier, supply chain y movilidad" },
  { id: 35, nombre: "Logística y Cadena de Suministro", descripcion: "Almacenamiento, distribución, importación y exportación" },
  { id: 36, nombre: "Transporte de Pasajeros", descripcion: "Aerolíneas, transporte terrestre, navieras y movilidad urbana" },
  // ── Agroindustria ─────────────────────────────────────────
  { id: 37, nombre: "Agroindustria", descripcion: "Agricultura, ganadería, pesca y agronegocios" },
  { id: 38, nombre: "Agritech", descripcion: "Tecnología aplicada al agro, riego inteligente y gestión de cultivos" },
  // ── Telecomunicaciones ────────────────────────────────────
  { id: 39, nombre: "Telecomunicaciones", descripcion: "Operadores móviles, internet, cable y comunicaciones empresariales" },
  { id: 40, nombre: "Medios y Entretenimiento", descripcion: "TV, radio, prensa, streaming y producción de contenido" },
  { id: 41, nombre: "Publicidad y Marketing Digital", descripcion: "Agencias creativas, performance marketing y gestión de marcas" },
  { id: 42, nombre: "Videojuegos y Entretenimiento Digital", descripcion: "Desarrollo de juegos, esports y experiencias interactivas" },
  // ── Turismo y Hostelería ──────────────────────────────────
  { id: 43, nombre: "Turismo y Hotelería", descripcion: "Hoteles, agencias de viaje, restauración y turismo receptivo" },
  { id: 44, nombre: "Gastronomía y Restaurantes", descripcion: "Restaurantes, franquicias de comida y servicios de catering" },
  // ── Gobierno y Tercer Sector ──────────────────────────────
  { id: 45, nombre: "Gobierno y Sector Público", descripcion: "Entidades estatales, municipios y organismos públicos" },
  { id: 46, nombre: "ONG y Tercer Sector", descripcion: "Fundaciones, asociaciones y organismos sin fines de lucro" },
  { id: 47, nombre: "Organismos Internacionales", descripcion: "Agencias de la ONU, BID, Banco Mundial y organismos multilaterales" },
  // ── Servicios Profesionales ───────────────────────────────
  { id: 48, nombre: "Consultoría y Servicios Profesionales", descripcion: "Auditoría, legal, RRHH y consultoría de negocio" },
  { id: 49, nombre: "Servicios Legales", descripcion: "Firmas de abogados, notarías y servicios de cumplimiento normativo" },
  { id: 50, nombre: "Recursos Humanos y Staffing", descripcion: "Reclutamiento, headhunting, outsourcing de RRHH y nómina" },
  { id: 51, nombre: "Investigación y Desarrollo (I+D)", descripcion: "Centros de investigación, laboratorios y transferencia tecnológica" },
  // ── Otros ─────────────────────────────────────────────────
  { id: 52, nombre: "Deportes", descripcion: "Clubes, federaciones, equipamiento deportivo y gestión de eventos" },
  { id: 53, nombre: "Arte y Cultura", descripcion: "Museos, galerías, fundaciones culturales y artes escénicas" },
  { id: 54, nombre: "Medioambiente y Sostenibilidad", descripcion: "Consultoría ambiental, reciclaje, economía circular y ESG" },
  { id: 55, nombre: "Blockchain y Web3", descripcion: "Criptomonedas, contratos inteligentes, NFTs y descentralización" },
  { id: 56, nombre: "Otro", descripcion: "Sector no listado" },
];

// ══════════════════════════════════════════════════════════════
// FUNCIÓN PRINCIPAL
// ══════════════════════════════════════════════════════════════

export const cargarCatalogos = async () => {
  try {
    // ── Países ──────────────────────────────────────────────
    await Pais.bulkCreate(PAISES, {
      updateOnDuplicate: ["nombre", "codigo_iso"],
      returning: false,
    });

    // ── Ciudades ─────────────────────────────────────────────
    await Ciudad.bulkCreate(CIUDADES, {
      updateOnDuplicate: ["nombre", "pais_id"],
      returning: false,
    });

    // ── Rubros ───────────────────────────────────────────────
    await Rubro.bulkCreate(RUBROS, {
      updateOnDuplicate: ["nombre", "descripcion"],
      returning: false,
    });
    await Estados.bulkCreate(ESTADOS, {
      updateOnDuplicate: ["nombre"],
      returning: false,
    });

  } catch (err) {
    console.error("❌ Error al cargar catálogos:", err.message);
    throw err;
  }
};

