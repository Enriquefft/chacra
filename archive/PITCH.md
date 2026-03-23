# Chacra — Pitch (5 min)

Optimized for Avanzar Rural Legacy Challenge evaluation criteria.
Reto principal: **Reto 4 — Gestion y trazabilidad de datos en contextos de baja conectividad**
Reto secundario (refuerza impacto): **Reto 2 — Gestion financiera y acceso a servicios financieros**

---

## Evaluation Criteria Reminder

| Criterio | Peso | Nuestra ventaja |
|----------|------|-----------------|
| Impacto social y relevancia | 35% | Tres audiencias beneficiadas. Transforma datos invisibles en historial crediticio. |
| Viabilidad tecnica y operativa | 35% | Producto funcional. Landing en vivo. Demos interactivos. No es un concepto. |
| Comprension del problema y contexto rural | 20% | Offline-first por diseno. Cooperativa como eje. Sin dependencia de conectividad. |
| Creatividad e innovacion | 10% | PWA offline con sync, credit scoring desde datos de campo, tres vistas en una app. |

---

## Structure (5 min strict)

### 1. Hook — El problema (30s)

> En el Peru rural, un agricultor puede producir y vender cafe por 10 anos y seguir siendo invisible para el sistema financiero. No tiene historial crediticio. No tiene registros. No tiene forma de demostrar que es un negocio viable. Y lo peor: la informacion que SI genera — cada venta, cada kilo, cada precio — se pierde porque no hay conectividad para registrarla.

Key data point: Avanzar Rural ha beneficiado a mas de 20,000 productores. Al cerrarse el programa, ese conocimiento y esos datos se pierden si no hay una herramienta que los capture.

### 2. Solucion — Que es Chacra (45s)

> Chacra convierte transacciones agricolas invisibles en datos estructurados y bancables.

Una sola app. Tres audiencias:
- **Agricultor**: registra sus ventas desde el celular, con o sin internet
- **Cooperativa**: ve trazabilidad, produccion, y cumplimiento de contratos de exportacion
- **Financiera**: ve perfiles crediticios construidos desde datos reales de campo

> No dependemos de internet. La app funciona offline. Los datos se sincronizan cuando hay conexion.

### 3. Demo en vivo (90s)

Show the live landing page: `chacra.404tf.com`

Walk through:
1. **Landing** — que es, para quien, como funciona (ya construido)
2. **Demo cooperativas** — dashboard con KPIs, produccion, trazabilidad
3. **Demo financieras** — scoring crediticio, perfiles de productores

> Esto no es un mockup. Es un producto real, desplegado, al que pueden entrar ahora mismo desde su celular.

### 4. Como funciona (30s)

```
Agricultor abre la app (sin internet)
  -> Llena formulario: producto, cantidad, precio, comprador
  -> Se guarda en el celular
  -> Cuando hay wifi: sincroniza automaticamente
  -> Servidor valida, detecta anomalias, calcula score crediticio
  -> Cooperativa ve produccion en tiempo real
  -> Financiera ve perfil crediticio actualizado
```

### 5. Impacto (30s)

- **Agricultores**: historial financiero por primera vez. Acceso a credito. Mejores precios al ver benchmarks del mercado.
- **Cooperativas**: trazabilidad para contratos de exportacion. Gestion de productores. Deteccion de anomalias.
- **Financieras**: reduccion de riesgo. Evaluacion crediticia basada en datos reales, no en garantias que el agricultor no tiene.

> Un agricultor con 6 meses de registros en Chacra tiene mas informacion crediticia que 10 anos de relacion informal con un intermediario.

### 6. Validacion y traccion (30s)

[UPDATE BEFORE PITCH with latest numbers]

- Producto funcional desplegado en produccion
- Landing page en vivo con demos interactivos
- Asesores: [nombre] (finanzas), [nombre] (agro)
- En conversacion con [N] cooperativas de [regiones]
- Contacto con [entidades financieras]
- Calendario abierto para reuniones con cooperativas interesadas

### 7. Cierre — El ask (15s)

> Chacra no es una idea. Es un producto que ya funciona. Lo que necesitamos es validacion en campo con cooperativas reales y el respaldo de este programa para escalar lo que Avanzar Rural construyo durante anos.

> Los datos ya existen. Solo necesitan un lugar donde vivir.

---

## Q&A Prep — Preguntas probables

**"Como se diferencia de un Excel o cuaderno?"**
> El cuaderno no sincroniza, no detecta anomalias, no genera un perfil crediticio, y se pierde. Chacra convierte esos mismos datos en informacion bancable.

**"Que pasa si el agricultor no tiene celular?"**
> Todo agricultor en Peru tiene un Android con cuenta de Google. La app es una PWA — no necesita descarga de Play Store. Se instala desde el navegador con un tap.

**"Como monetizan?"**
> La cooperativa o la financiera paga. El agricultor nunca paga. Modelo SaaS por cooperativa o por scoring crediticio consumido. El valor para la financiera es reduccion de riesgo; para la cooperativa, trazabilidad para exportacion.

**"Que tan viable es la adopcion?"**
> El agricultor ya registra ventas — en papel o de memoria. Chacra reemplaza eso con un formulario de 4 campos que toma 15 segundos. La cooperativa es quien lo impulsa porque necesita los datos para sus contratos. El incentivo esta alineado.

**"Que pasa con la integridad de los datos si el agricultor miente?"**
> Tres capas: consistencia temporal (volumen y precio vs historial propio), validacion cruzada (datos del agricultor vs registros de la cooperativa), y triaje humano (la cooperativa revisa los casos sospechosos). Cada agricultor tiene un trust score de 0-100.

**"Por que no usan WhatsApp/SMS?"**
> WhatsApp requiere parsear lenguaje natural, lo cual es fragil e impreciso. Un formulario estructurado genera datos limpios desde el origen. Menos errores, mas confianza en los datos, y funciona sin internet — WhatsApp no.

**"Que escala pueden alcanzar?"**
> Solo Avanzar Rural tiene 20,000+ productores y 1,000+ planes de negocio. La Junta Nacional del Cafe tiene 56 cooperativas con 70,000 familias. Cada cooperativa que se sube trae a sus agricultores. El crecimiento es cooperativa por cooperativa — cada una es un canal de distribucion.

**"Conocen Agros? En que se diferencian?"**
> Si. Agros hace identidad digital del agricultor con agentes de campo, blockchain y georreferenciacion. Son complementarios: ellos capturan quien es el agricultor y donde produce. Nosotros capturamos que vende, cuanto, a que precio, y lo convertimos en un perfil crediticio. Agros necesita agentes en campo — nosotros no, el agricultor opera la app solo. Juntos darian a una financiera el perfil completo.

**"Que pasa con la regulacion europea (EUDR)?"**
> La EUDR exige trazabilidad per-agricultor para cafe, cacao y otros productos importados a Europa. Las cooperativas que exportan necesitan exactamente los datos que Chacra captura. No es un nice-to-have — es compliance obligatorio desde 2025.

---

## Delivery Notes

- Lead with the HUMAN story, not the tech. The judges value impact (35%) over innovation (10%).
- During demo, keep the phone/screen visible. Let them SEE the product. This is the differentiator — most teams will have slides, you have a working product.
- Speak slowly. 5 minutes is enough if you don't rush.
- Numbers > adjectives. "4 campos, 15 segundos" beats "facil de usar".
- End with the emotional line about data already existing. Let it land.
