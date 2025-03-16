from datetime import datetime
from typing import List, Dict, Any, Optional, Union
from pydantic import BaseModel, Field

class HistorialPago(BaseModel):
    fecha: str
    monto: int
    estado: str


class CuentaCredito(BaseModel):
    id: str
    tipo: str
    entidad: str
    fecha_apertura: str
    monto_original: int
    saldo_actual: int
    limite_credito: int
    tasa_interes: float
    plazo_meses: int
    estado: str
    historial_pagos: List[HistorialPago]


class CreditoProveedor(BaseModel):
    id: str
    proveedor: str
    terminos_pago: str
    limite_credito: int
    saldo_actual: int
    historial_pagos: List[HistorialPago]


class SolicitudCredito(BaseModel):
    fecha: str
    entidad: str
    tipo: str
    monto: int
    estado: str


class IncidenteCrediticio(BaseModel):
    tipo: str
    fecha: str
    entidad: str
    detalles: str
    monto: int
    estado: str


class HistorialCrediticio(BaseModel):
    cuentas_credito: List[CuentaCredito]
    credito_proveedores: List[CreditoProveedor]
    solicitudes_credito_recientes: List[SolicitudCredito]
    incidentes_crediticios: List[IncidenteCrediticio]


class InformacionGeneral(BaseModel):
    nombre_empresa: str
    nit: str
    direccion: str
    telefono: str
    correo: str
    sitio_web: str
    fecha_fundacion: str
    sector: str
    tamano_empresa: str
    numero_empleados: int
    representante_legal: str
    pais: str


class DatosMensualesVentas(BaseModel):
    mes: str
    total: int
    online: int
    tienda: int


class CategoriaVenta(BaseModel):
    categoria: str
    porcentaje: int


class MetricasVentas(BaseModel):
    ticket_promedio: int
    tasa_conversion: float
    ciclo_venta_promedio_dias: int
    costo_adquisicion_cliente: int


class VentasMensuales(BaseModel):
    datos_mensuales: List[DatosMensualesVentas]
    ventas_por_categoria: List[CategoriaVenta]
    metricas_ventas: MetricasVentas


class DatosMensualesMargen(BaseModel):
    mes: str
    ingresos: int
    costo_ventas: int
    gastos_operativos: int
    margen_bruto: float
    margen_neto: float


class MargenBeneficio(BaseModel):
    datos_mensuales: List[DatosMensualesMargen]


class DatosMensualesGastos(BaseModel):
    mes: str
    total: int
    fijos: int
    variables: int


class DesgloseGasto(BaseModel):
    categoria: str
    monto_mensual_promedio: int
    porcentaje: float
    tipo: str


class Gastos(BaseModel):
    datos_mensuales: List[DatosMensualesGastos]
    desglose_gastos: List[DesgloseGasto]


class DatosMensualesFlujo(BaseModel):
    mes: str
    saldo_inicial: int
    ingresos: int
    egresos: int
    saldo_final: int


class FlujoCaja(BaseModel):
    datos_mensuales: List[DatosMensualesFlujo]


class ProductoIngreso(BaseModel):
    producto: str
    ingresos_anuales: int
    porcentaje: float


class ClienteIngreso(BaseModel):
    tipo_cliente: str
    ingresos_anuales: int
    porcentaje: float


class DistribucionIngresos(BaseModel):
    por_producto: List[ProductoIngreso]
    por_cliente: List[ClienteIngreso]


class ObjetivoVenta(BaseModel):
    trimestre: str
    objetivo: int
    logrado: int
    porcentaje_cumplimiento: float


class RendimientoVendedor(BaseModel):
    vendedor: str
    ventas_anuales: int
    clientes_nuevos: int
    tasa_cierre: float


class GestionVentas(BaseModel):
    objetivos: List[ObjetivoVenta]
    rendimiento_vendedores: List[RendimientoVendedor]


class CanalVenta(BaseModel):
    canal: str
    ventas_anuales: int
    porcentaje: float
    crecimiento_anual: float


class RegionVenta(BaseModel):
    region: str
    ventas_anuales: int
    porcentaje: float
    crecimiento_anual: float


class RendimientoVentas(BaseModel):
    por_canal: List[CanalVenta]
    por_region: List[RegionVenta]


class ComparativoAnual(BaseModel):
    ano: int
    ingresos_totales: int
    gastos_totales: int
    beneficio_neto: int
    margen_neto: float


class IngresosVsGastos(BaseModel):
    comparativo_anual: List[ComparativoAnual]


class ROIProyecto(BaseModel):
    proyecto: str
    inversion: int
    beneficio_neto: int
    roi: float
    periodo: str


class CicloConversionEfectivo(BaseModel):
    ano: int
    dio: int  # días inventario outstanding
    dso: int  # días sales outstanding
    dpo: int  # días payable outstanding
    ccc: int  # cash conversion cycle


class DatosCicloConversion(BaseModel):
    datos_anuales: List[CicloConversionEfectivo]


class RatioFinanciero(BaseModel):
    ratio: str
    valor: float
    industria: float
    tendencia: str


class IndicadoresFinancieros(BaseModel):
    roi: List[ROIProyecto]
    ciclo_conversion_efectivo: DatosCicloConversion
    ratios_financieros: List[RatioFinanciero]


class MaximoMinimo(BaseModel):
    mes: str
    valor: int


class TendenciaMensual(BaseModel):
    promedio_mensual: int
    maximo: MaximoMinimo
    minimo: MaximoMinimo
    variacion_porcentual_anual: float


class TendenciasMensuales(BaseModel):
    mensual_2022: TendenciaMensual = Field(alias="2022")
    mensual_2023: TendenciaMensual = Field(alias="2023")


class Estacionalidad(BaseModel):
    temporada_alta: List[str]
    temporada_media: List[str]
    temporada_baja: List[str]


class AnalisisGastos(BaseModel):
    tendencias_mensuales: TendenciasMensuales
    estacionalidad: Estacionalidad


class MetricaSostenibilidad(BaseModel):
    metrica: str
    valor: int
    industria: int


class IniciativaSostenibilidad(BaseModel):
    iniciativa: str
    estado: str
    impacto: str


class Sostenibilidad(BaseModel):
    puntuacion: int
    metricas: List[MetricaSostenibilidad]
    iniciativas: List[IniciativaSostenibilidad]


class MetricaFiscal(BaseModel):
    metrica: str
    valor: int
    industria: int


class HistorialFiscal(BaseModel):
    ano: int
    declaraciones_tiempo: str
    pagos_tiempo: str
    auditorias: str


class CumplimientoFiscal(BaseModel):
    puntuacion: int
    metricas: List[MetricaFiscal]
    historial: List[HistorialFiscal]


class MetricaLaboral(BaseModel):
    metrica: str
    valor: int
    industria: int


class IniciativaLaboral(BaseModel):
    iniciativa: str
    estado: str
    impacto: str


class PracticasLaborales(BaseModel):
    puntuacion: int
    metricas: List[MetricaLaboral]
    iniciativas: List[IniciativaLaboral]


class MetricaFinanciera(BaseModel):
    metrica: str
    valor: float
    industria: float


class TendenciaFinanciera(BaseModel):
    periodo: str
    crecimiento_anual: str
    volatilidad: str


class EstabilidadFinanciera(BaseModel):
    puntuacion: int
    metricas: List[MetricaFinanciera]
    tendencias: List[TendenciaFinanciera]


class MetricaPagos(BaseModel):
    metrica: str
    valor: float
    industria: float


class HistorialPagos(BaseModel):
    ano: int
    a_tiempo: str
    dias_promedio: int
    incidentes: int


class PuntualidadPagos(BaseModel):
    puntuacion: int
    metricas: List[MetricaPagos]
    historial: List[HistorialPagos]


class MetricaInnovacion(BaseModel):
    metrica: str
    valor: float
    industria: float


class IniciativaInnovacion(BaseModel):
    iniciativa: str
    estado: str
    lanzamiento: Optional[str] = None
    impacto: Optional[str] = None


class Innovacion(BaseModel):
    puntuacion: int
    metricas: List[MetricaInnovacion]
    iniciativas: List[IniciativaInnovacion]


class ComponentesTrustScore(BaseModel):
    sostenibilidad: Sostenibilidad
    cumplimiento_fiscal: CumplimientoFiscal
    practicas_laborales: PracticasLaborales
    estabilidad_financiera: EstabilidadFinanciera
    puntualidad_pagos: PuntualidadPagos
    innovacion: Innovacion


class HistoricoTrustScore(BaseModel):
    trimestre: str
    puntuacion: int
    variacion: int


class BeneficioTrustScore(BaseModel):
    beneficio: str
    entidad: str
    detalle: str


class PYME360TrustScore(BaseModel):
    calificacion_global: int
    componentes: ComponentesTrustScore
    historico: List[HistoricoTrustScore]
    beneficios_obtenidos: List[BeneficioTrustScore]


class TextilesAndinosModel(BaseModel):
    _id: Dict[str, str]
    informacion_general: InformacionGeneral
    historial_crediticio: HistorialCrediticio
    ventas_mensuales: VentasMensuales
    margen_beneficio: MargenBeneficio
    gastos: Gastos
    flujo_caja: FlujoCaja
    distribucion_ingresos: DistribucionIngresos
    gestion_ventas: GestionVentas
    rendimiento_ventas: RendimientoVentas
    ingresos_vs_gastos: IngresosVsGastos
    indicadores_financieros: IndicadoresFinancieros
    analisis_gastos: AnalisisGastos
    pyme360_trust_score: PYME360TrustScore

class UserCreate(BaseModel):
    username: str
    password: str
    informacion_general: InformacionGeneral
    historial_crediticio: HistorialCrediticio
    ventas_mensuales: VentasMensuales
    margen_beneficio: MargenBeneficio
    gastos: Gastos
    flujo_caja: FlujoCaja
    distribucion_ingresos: DistribucionIngresos
    gestion_ventas: GestionVentas
    rendimiento_ventas: RendimientoVentas
    ingresos_vs_gastos: IngresosVsGastos
    indicadores_financieros: IndicadoresFinancieros
    analisis_gastos: AnalisisGastos
    pyme360_trust_score: PYME360TrustScore

class UserLogin(BaseModel):
    username: str
    password: str