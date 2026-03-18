# Validación: supuestos y preguntas clave

## Supuestos críticos (alto riesgo si están mal)

### 1. Comportamiento en WhatsApp
**Supuesto:** Los productores mandan mensajes de texto describiendo sus ventas naturalmente.
**Riesgo:** Prefieren audios de voz (voice notes) → cambia el pipeline de parsing.
**Pregunta:** ¿Mandan texto o audio cuando describen una venta a un comprador o familiar?

### 2. Motivación inmediata del productor
**Supuesto:** El productor registrará sus ventas con disciplina.
**Riesgo:** El beneficio (score crediticio) es a largo plazo. Sin ganancia inmediata, no hay adopción.
**Pregunta:** ¿Qué gana el productor HOY por registrar? ¿Hay algo de valor inmediato?

### 3. La cooperativa como canal de distribución
**Supuesto:** La cooperativa puede incentivar o mandar a sus asociados a usar la herramienta.
**Riesgo:** La cooperativa no tiene ese poder sobre sus miembros.
**Pregunta:** ¿Han logrado antes que los asociados adopten una herramienta digital? ¿Cómo?

### 4. Sistemas existentes
**Supuesto:** No hay herramienta de registro que el productor ya use.
**Riesgo:** Ya existe algo y Chacra duplica esfuerzo o genera fricción.
**Pregunta:** ¿Qué usan hoy los promotores para registrar transacciones de productores?

### 5. Voluntad de pago de cooperativas
**Supuesto:** Las cooperativas pagarán $50–200/mes por dashboards de trazabilidad.
**Riesgo:** No tienen presupuesto o no perciben el valor sin prueba.
**Mitigación:** Empezar gratis durante el piloto, cobrar cuando se demuestre valor en exportaciones.

## Preguntas clave por stakeholder

### Para Freddy Zuta (Gestión del Conocimiento)
- ¿Qué activos de conocimiento de Avanzar Rural están en riesgo de perderse al cierre?
- ¿En qué formato están hoy los datos de los productores?
- ¿Hay intención de transferir el SISEP a otra institución?

### Para Percy Portillo (S&E)
- ¿Qué métricas no pueden medir hoy por falta de datos del propio productor?
- ¿El SISEP puede recibir datos de fuentes externas o solo de promotores?
- ¿Qué pasará con el SISEP cuando cierre el programa?

### Para Carlos Córdova (APOYO / Política Pública)
- ¿Hay financieras interesadas en scoring alternativo para productores rurales en Perú?
- ¿Qué modelos de sostenibilidad post-programa han visto funcionar en contextos similares?

### Para cualquier stakeholder
- Si esto existiera el día que Avanzar Rural cierre, ¿quién pagaría para mantenerlo — y cuánto?
- ¿Pueden dar un caso concreto de productor que perdió acceso a crédito/mercado por falta de historial?

## Riesgo crítico: integridad de datos (fraud/inflación de ventas)

### El problema
Sin boletas, sin recibos, sin Yape — las transacciones rurales son 100% cash.
Muchos agricultores venden a **acopiadores** (intermediarios informales), no a compradores formales.
Un productor puede declarar haber vendido el doble de lo real para inflar su score crediticio.
Las financieras y cooperativas no adoptarán el sistema si no confían en la calidad del dato.

### Por qué es el riesgo más serio
- Destruye el valor del score crediticio (el producto B2B principal)
- Una financiera que presta basándose en datos inflados pierde dinero → abandona la plataforma
- El mercado de crédito rural ya es desconfiado por defecto

### Modelo de triage propuesto
Tres capas de confianza, en orden de costo creciente:

**Capa 1 — Consistencia temporal (automática)**
Detectar patrones anómalos: saltos bruscos de volumen, precios fuera de rango de mercado,
frecuencia irregular. Un productor que vendía 50kg/mes y de repente declara 500kg es una alerta.

**Capa 2 — Validación cruzada (semi-automática)**
Contrastar con datos de la cooperativa a la que pertenece. Si la cooperativa registra
acopio de X kg del productor y él declaró 3X, hay inconsistencia.

**Capa 3 — Verificación física (humana, bajo demanda)**
Los casos marcados como sospechosos por las capas 1 y 2 son derivados a un promotor
o validador que confirma presencialmente. Solo los casos atípicos llegan acá — el sistema
actúa como triage para que el humano intervenga donde realmente importa.

### Contexto clave: el acopiador como fuente de verdad
El acopiador compra a múltiples productores y sí lleva registro (aunque informal).
Oportunidad: si el acopiador también usa Chacra (o si la cooperativa tiene datos de acopio),
esa fuente independiente valida automáticamente los registros del productor.

### Implicación para el pitch
No esconder este riesgo — nombrarlo primero genera credibilidad:
> "La pregunta obvia es: ¿cómo saben que los datos son reales? Tres capas:
> consistencia temporal, validación cruzada con la cooperativa, y triage humano
> para los casos sospechosos. La consistencia a lo largo del tiempo es la mejor
> validación que existe — es imposible mentir de forma consistente durante 8 meses."

## Lo que ya está validado
- El problema existe: datos en cuadernos, promotores como único puente
- El impacto de tener datos es real: +149% ingresos, +607% activos (caso Mendoza)
- La infraestructura SISEP ya existe: hay un pipeline que Chacra puede alimentar
- WhatsApp tiene cobertura ~95% en la red rural de Spinout
- Avanzar Rural cierra: el pipeline de datos se rompe sin una solución como Chacra

## Lo que falta validar (antes del Demo Day)
- [ ] Comportamiento real en WhatsApp (texto vs voz)
- [ ] Qué beneficio inmediato percibe el productor
- [ ] Interés concreto de al menos una cooperativa
- [ ] Compatibilidad técnica con SISEP (¿puede recibir datos externos?)
- [ ] Caso real de productor sin acceso a crédito por falta de historial
