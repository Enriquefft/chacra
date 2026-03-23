# Chacra — Playbook

Outreach templates, pitch framing, and objection handling. Living doc — update as we learn what works.

---

## The Narrative

**One-liner:**
> Chacra es la infraestructura de datos crediticios para la economía agrícola no bancarizada.

**Elevator (30s):**
> En Perú, S/1,800 millones en crédito agrícola se van a desplegar en 2026, en gran parte a ciegas. Capturamos datos transaccionales en el punto de venta — offline, en el momento de la transacción — y los convertimos en perfiles crediticios que las financieras pueden usar. Nuestra distribución son las cooperativas: una relación nos da 5,000 agricultores. La UE ahora exige exactamente estos datos para importaciones. No estamos construyendo una feature — estamos construyendo el buró de crédito para una economía que no tiene uno.

---

## Message Templates

### Cooperativas (WhatsApp)

> Hola [nombre], soy [tu nombre] de Chacra. Estamos desarrollando una herramienta gratuita para cooperativas agrarias que permite a sus productores registrar ventas desde el celular — funciona sin internet. La cooperativa obtiene trazabilidad en tiempo real y datos para contratos de exportación y cumplimiento EUDR.
>
> Tenemos un producto funcional desplegado en [chacra.404tf.com]. Si les interesa evaluar un piloto con algunos productores, me encantaría conversarlo.
>
> ¿Podemos agendar una llamada rápida?

### Cooperativas — Vía JNC o umbrella (WhatsApp/email)

> Hola [nombre], soy [tu nombre] de Chacra. [Referente] de [organización] me sugirió contactarlos. Estamos trabajando con cooperativas cafetaleras en una herramienta offline de trazabilidad que también genera perfiles crediticios para sus productores.
>
> Me gustaría entender cómo están abordando el tema de trazabilidad EUDR. ¿Tienen 15 minutos esta semana?

### Financieras (email)

> Asunto: Datos transaccionales de campo para evaluación crediticia rural
>
> Estimado/a [nombre],
>
> Soy [tu nombre] de Chacra. Estamos creando perfiles crediticios para productores rurales a partir de datos reales de transacciones agrícolas — registrados desde una app que funciona offline.
>
> Sabemos que evaluar riesgo en el sector agrario rural es difícil por falta de datos. Chacra genera ese historial: producto, cantidad, precio, comprador, con validación de integridad y trust score.
>
> Nos interesa entender: ¿qué datos necesitarían ver en un perfil crediticio para reducir su costo de evaluación? ¿Qué haría que confíen en los datos?
>
> Tenemos un demo en chacra.404tf.com/demo-financieras. ¿Podemos agendar 15 minutos?

### Financieras — COFIDE angle (email)

> Asunto: Herramienta de scoring crediticio para productores agrarios — alineación con PRIDER/canales COFIDE
>
> Estimado/a [nombre],
>
> Chacra genera perfiles crediticios para productores rurales a partir de datos transaccionales capturados offline por los propios agricultores. El sistema valida integridad de datos, detecta anomalías, y produce un trust score por productor.
>
> Creemos que esta herramienta podría complementar los canales de COFIDE hacia instituciones financieras que atienden al sector agrario. Nos gustaría explorar la posibilidad de una validación conjunta.
>
> ¿Podríamos agendar una reunión exploratoria?

### Umbrella orgs / JNC (LinkedIn — max 200 chars)

> Hola [nombre], desarrollamos una herramienta offline gratuita de trazabilidad para cooperativas cafetaleras (EUDR). ¿La JNC está trabajando en esto con sus asociadas?

### Umbrella orgs / JNC — longer (LinkedIn message)

> Hola [nombre], soy [tu nombre] — estamos desarrollando una herramienta offline gratuita de trazabilidad para cooperativas cafetaleras, pensando en cumplimiento EUDR. Me encantaría conocer cómo la JNC está abordando este tema con sus asociadas.

### Funders / Allies (email)

> Asunto: Chacra — plataforma offline de datos agrícolas para inclusión financiera
>
> Estimado/a [nombre],
>
> Somos Chacra, una plataforma que convierte transacciones agrícolas invisibles en datos estructurados y bancables. Funciona offline, es operada por el propio agricultor, y genera perfiles crediticios para financieras.
>
> Estamos en conversación con cooperativas en [regiones] y buscamos [lo que buscas: funding/alianza/validación]. Nuestro producto está desplegado y funcional.
>
> ¿Podemos agendar una conversación?

---

## Objection Handling

**"Ya tenemos Excel / cuaderno"**
> El cuaderno no sincroniza, no detecta anomalías, no genera un perfil crediticio, y se pierde. Chacra convierte esos mismos datos en información bancable. Y es gratis para los productores.

**"El agricultor no va a usar otra app"**
> Formulario de 4 campos, 15 segundos. Funciona sin internet. La cooperativa lo impulsa porque necesita los datos para sus contratos. El incentivo está alineado.

**"¿Qué pasa si el agricultor miente?"**
> Tres capas: consistencia temporal (volumen y precio vs historial), validación cruzada (datos del agricultor vs registros de la cooperativa), y triaje humano (la cooperativa revisa casos sospechosos). Cada agricultor tiene un trust score de 0-100.

**"¿Cómo monetizan?"**
> La cooperativa o la financiera paga. El agricultor nunca paga. SaaS mensual por cooperativa, o scoring crediticio por perfil consumido. El valor para la financiera es reducción de riesgo; para la cooperativa, trazabilidad para exportación.

**"¿Conocen Agros?"**
> Sí. Son complementarios. Agros hace identidad + georreferenciación con agentes de campo. Nosotros capturamos transacciones — qué vende, cuánto, a qué precio — y lo convertimos en perfil crediticio. Ellos necesitan agentes; nosotros no. Juntos darían a una financiera el perfil completo.

**"¿Y la EUDR?"**
> La EUDR exige trazabilidad per-agricultor para café, cacao y otros productos importados a Europa. Las cooperativas que exportan necesitan exactamente los datos que Chacra captura. No es un nice-to-have — es compliance obligatorio.

**"¿Por qué no WhatsApp/SMS?"**
> WhatsApp requiere parsear lenguaje natural, es frágil e impreciso. Un formulario estructurado genera datos limpios desde el origen. Menos errores, más confianza, y funciona sin internet — WhatsApp no.

---

## Channel Strategy

| Channel | Speed | Best for |
|---------|-------|----------|
| WhatsApp directo | Fastest | Cooperativas, contactos individuales |
| LinkedIn DM | Fast | Financieras, NGOs, institucional |
| Email institucional | Medium | Entidades formales, gobierno, funders |
| Instagram | Research only | Scouting events, contacts, current focus |

---

## Conversation Goals

**First contact with a cooperative:**
1. Understand their current traceability process (paper? Excel? nothing?)
2. Ask about EUDR pressure
3. Get a "sí, nos interesaría evaluar un piloto"
4. Ask: "¿quién les da crédito a sus productores?" (warm intro to financiera)

**First contact with a financiera:**
1. Understand their current rural evaluation process and cost
2. Ask: "¿qué datos necesitarían para confiar en un perfil crediticio generado desde campo?"
3. Validate our scoring model assumptions
4. Plant the seed for a future data partnership

**First contact with an umbrella org (JNC, etc.):**
1. Understand how they're approaching EUDR for members
2. Ask for introductions to 3-5 member coops
3. Explore whether Chacra could be a recommended tool
