# MSP — Minimum Sellable Product — Chacra

No estamos construyendo un prototipo funcional. Estamos construyendo algo que una cooperativa
mire y diga "¿cuánto cuesta?" y que un juez mire y diga "esto ya existe."

La landing page ya está. El system design ya está. Lo que sigue no es solo hacer que funcione —
es hacer que se sienta real, profesional, y que el valor sea obvio en 10 segundos.

---

## Mentalidad MSP vs MVP

| MVP | MSP |
|-----|-----|
| "Funciona" | "Pagaría por esto" |
| Feature checklist | Experiencia completa |
| Demuestra tecnología | Demuestra valor |
| El juez entiende la idea | El juez quiere usarlo |
| Datos de prueba genéricos | Datos que cuentan una historia real |
| UI funcional | UI que genera confianza |

---

## Propuesta de valor (una línea por audiencia)

**Productor (corto plazo):** "Registra tu venta por WhatsApp. Te decimos si te están pagando bien."
**Productor (largo plazo):** "Tu historial de ventas se convierte en tu score crediticio. 6 meses registrando = acceso a préstamos sin garantía."
**Cooperativa:** "Ve en tiempo real cuánto producen tus asociados y a qué precio venden."
**Financiera:** "Score crediticio alternativo basado en transacciones reales verificadas."
**Juez del challenge:** "Esto ya funciona. Pruébalo ahora."

---

## Los 5 momentos de demo (cada uno debe VENDER, no solo mostrar)

### Momento 1: WhatsApp — "así de fácil"
Mandar mensaje en vivo: "vendi 50kg cafe a 8 soles al juan"
Bot responde con confirmación + señal de precio.
**No demuestra tecnología — demuestra que cualquier agricultor puede usarlo YA.**
El juez debe pensar: "mi abuela podría usar esto."

### Momento 2: PWA offline — "sin internet, sin problema"
Celular en modo avión. Registrar venta. "Guardado localmente."
Quitar modo avión. Sincronizar. Dashboard se actualiza en vivo.
**No demuestra sync — demuestra que la conectividad no es barrera.**
El juez debe pensar: "esto funciona en Cajamarca ahora mismo."

### Momento 3: Señal de precio — "el dato que vale plata"
Después de registrar: "Cafe en Cajamarca: S/7.50 - S/9.00/kg. Tu venta: S/8.00."
**No demuestra analytics — demuestra que registrar te da algo de valor inmediato.**
El juez debe pensar: "si yo fuera agricultor, querría saber esto."

### Momento 4: Dashboard cooperativa — "el producto real"
Laptop: producción por cultivo, productores activos, trazabilidad completa,
volumen acumulado vs meta de exportación, benchmark de precios.
**No demuestra charts — demuestra que una cooperativa tomaría decisiones con esto.**
El juez debe pensar: "esto es un SaaS real, no un proyecto de hackathon."

### Momento 5: Integridad de datos — "nos adelantamos a la pregunta"
Productor flaggeado vs limpio. Las 3 capas de triage.
**No demuestra ML — demuestra que pensamos como una financiera piensa.**
El juez debe pensar: "estos entienden que la data sin confianza no vale nada."

---

## Qué hace que esto se sienta SELLABLE (no solo funcional)

### 1. Diseño del dashboard
No es un CRUD con tabla. Es un producto que un gerente de cooperativa abriría todos los días.
- Métricas grandes y claras arriba (KPIs)
- Colores con intención (verde = bien, amarillo = atención, rojo = alerta)
- Tipografía legible, espaciado generoso
- Se siente como un producto de $200/mes, no como un proyecto universitario

### 2. Respuestas del bot WhatsApp
No es un JSON formateado. Es un mensaje que un agricultor lee y entiende.
- Usa soles (S/), no USD
- Usa "kg" no "kilogramos"
- Confirmación clara con total calculado
- Señal de precio integrada naturalmente, no como feature separada
- Tono: directo, respetuoso, sin emojis innecesarios
- Si no entiende: respuesta amigable, no error técnico

### 3. PWA
No es un formulario HTML. Se siente como una app nativa.
- Add-to-homescreen funcional
- Transiciones suaves
- Touch targets grandes (agricultores con manos grandes, pantallas chicas)
- Estado offline claramente comunicado (no ambiguo)
- Sync se siente confiable: progreso visible, confirmación clara

### 4. Seed data que cuenta una historia
No son "Test User 1" con datos random. Son:
- María Quispe de Cajamarca, produce café, 8 meses de historial consistente, trust score alto
- José Mendoza de San Martín, produce cacao, venta reciente flaggeada por volumen atípico
- Cooperativa Agraria Valle Verde, 12 asociados activos, 3.2 / 5.0 toneladas para contrato
- Precios reales de café, cacao, cuy por región (basados en MIDAGRI)
- Transacciones con variedad: distintos compradores, distintos precios, distintas fechas

### 5. Landing page (ya existe) como puerta de entrada
La URL que compartes en la sala del challenge lleva a algo profesional.
De ahí: "Pruébalo" → PWA. "¿Eres cooperativa?" → Dashboard.
La landing no es adorno — es el primer punto de conversión.

---

## Scope MSP

### MUST SHIP (el producto mínimo que se vende)

**WhatsApp Bot**
- Webhook recibe mensaje
- Claude Haiku parsea a JSON (producto, cantidad, unidad, precio, comprador)
- Guarda en PostgreSQL
- Responde confirmación con total + señal de precio
- Registration flow (nombre + región)
- Respuesta amigable si no entiende
- Productos: Cacao, Cafe, Cerdo, Cuy, Fresa, Granadilla, Huevo, Leche, Lechon, Maiz Amarillo, Maiz Morado

**PWA Offline**
- Form de venta (dropdown productos, cantidad, unidad, precio, comprador, fecha)
- IndexedDB via Dexie.js
- Historial local de transacciones con señal de precio
- Sync-on-open + botón "Sincronizar" con badge
- Banner offline
- UI mobile-first, touch targets grandes, se siente como app nativa
- Add-to-homescreen configurado

**Sync API**
- POST /api/sync: batch, validar, deduplicar UUID, insertar
- Flag automático precio/volumen fuera de rango
- Retornar señales de precio actualizadas en la respuesta del sync

**Dashboard Cooperativa**
- KPIs arriba: producción total, productores activos, ingreso del período, volumen vs meta
- Tabla de trazabilidad: productor > producto > cantidad > precio > comprador > fecha > fuente
- Benchmark de precios por cultivo (visual, claro)
- Indicador de volumen agregado vs meta exportación
- Vista de integridad: transacciones flaggeadas + trust score por productor
- Diseño profesional — se ve como SaaS, no como hackathon

**Seed Data (esto es parte del producto, no un afterthought)**
- Precios referencia MIDAGRI por cultivo/región
- 15-20 productores con nombres reales, regiones reales, historiales creíbles
- 1 productor flaggeado + 1 limpio (contraste claro en triage)
- 1 cooperativa con meta de exportación y progreso visible
- Transacciones que cubran 3-6 meses para que las tendencias se vean
- Auth con roles completo

- Corrección por WhatsApp ("no, fueron 60 kilos")
- Gráfico tendencia de precios (line chart) en dashboard
- Gráfico producción por cultivo (bar chart) en dashboard
- Filtros: cultivo, región, fecha
- Export CSV
- Credit score view por productor (risk tier + métricas)
- Voice note transcription (Whisper)
- Alertas de umbral cooperativa
- Vista individual de productor en dashboard

### NO ENTRA

- SMS
- Background sync
- Integración real con SISEP (pitch como roadmap)

---

## Orden de construcción

Landing y system design listos. Lo que sigue:

**Bloque 1: Plumbing**
1. Supabase schema migration
2. Seed precios MIDAGRI + datos demo realistas
3. API sync endpoint
4. Deploy Vercel (URL funcional desde el minuto 1)

**Bloque 2: WhatsApp Bot (momento de demo más impactante)**
5. Webhook endpoint
6. Claude Haiku parsing
7. Registration flow
8. Confirmación + señal de precio
9. Respuesta amigable para errores
10. Test con teléfono real

**Bloque 3: PWA Offline (diferenciación técnica)**
11. Dexie.js + form de registro
12. Guardar local + historial con señales de precio
13. Sync logic + banner offline
14. UI polish: mobile-first, touch targets, transiciones

**Bloque 4: Dashboard (el producto que se vende)**
15. KPIs + layout profesional
16. Tabla trazabilidad
17. Benchmark precios visual
18. Vista integridad / triage
19. Indicador volumen vs meta
20. Polish: colores, tipografía, espaciado — se ve como SaaS
