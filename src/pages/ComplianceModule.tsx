
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Calendar, FileText, HelpCircle, AlertCircle, Check, Clock, FilePlus2 } from "lucide-react";

const ComplianceModule = () => {
  const [activeTab, setActiveTab] = useState<string>("calendar");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Espaciador para evitar que el navbar fijo se superponga al contenido */}
      <div className="h-16"></div>
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Cumplimiento Regulatorio
          </h1>
          <p className="text-gray-600">
            Gestión simplificada de obligaciones legales y trámites gubernamentales
          </p>
        </div>

        {/* Tabs de navegación */}
        <div className="flex overflow-x-auto space-x-2 mb-8 pb-2">
          <TabButton 
            active={activeTab === "calendar"} 
            onClick={() => setActiveTab("calendar")}
            icon={<Calendar size={16} />}
            label="Calendario de Obligaciones"
          />
          <TabButton 
            active={activeTab === "resources"} 
            onClick={() => setActiveTab("resources")}
            icon={<FileText size={16} />}
            label="Recursos Legales"
          />
          <TabButton 
            active={activeTab === "procedures"} 
            onClick={() => setActiveTab("procedures")}
            icon={<HelpCircle size={16} />}
            label="Gestión de Trámites"
          />
        </div>

        {/* Contenido según la tab seleccionada */}
        {activeTab === "calendar" && <ComplianceCalendarContent />}
        {activeTab === "resources" && <LegalResourcesContent />}
        {activeTab === "procedures" && <ProceduresManagementContent />}
      </main>
      
      <Footer />
    </div>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton = ({ active, onClick, icon, label }: TabButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
        active 
          ? "bg-pyme-blue text-white font-medium shadow-sm" 
          : "bg-white text-gray-600 hover:bg-gray-100"
      }`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
};

const ComplianceCalendarContent = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Mayo 2024</h2>
          <div className="flex space-x-2">
            <ButtonCustom variant="outline" size="sm">Anterior</ButtonCustom>
            <ButtonCustom variant="outline" size="sm">Siguiente</ButtonCustom>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
          
          {/* Ejemplo de un mes */}
          {Array.from({ length: 35 }, (_, i) => {
            const dayNumber = i - 2; // Ajuste para empezar el mes un miércoles
            const hasTask = [5, 10, 15, 20, 25].includes(dayNumber);
            const isUrgent = [15].includes(dayNumber);
            
            return (
              <div 
                key={i} 
                className={`
                  h-24 p-1 border border-gray-100 rounded-md hover:border-gray-300 transition-colors
                  ${dayNumber <= 0 || dayNumber > 31 ? 'opacity-50 bg-gray-50' : 'bg-white'}
                  ${hasTask ? 'ring-1 ring-inset ring-amber-500' : ''}
                  ${isUrgent ? 'ring-1 ring-inset ring-red-500' : ''}
                `}
              >
                {dayNumber > 0 && dayNumber <= 31 && (
                  <>
                    <div className="text-right text-sm">{dayNumber}</div>
                    {dayNumber === 5 && (
                      <div className="mt-1 text-xs p-1 bg-amber-50 rounded border border-amber-100 text-amber-800">
                        Impuesto IVA
                      </div>
                    )}
                    {dayNumber === 10 && (
                      <div className="mt-1 text-xs p-1 bg-blue-50 rounded border border-blue-100 text-blue-800">
                        Reporte empleados
                      </div>
                    )}
                    {dayNumber === 15 && (
                      <div className="mt-1 text-xs p-1 bg-red-50 rounded border border-red-100 text-red-800">
                        Declaración mensual
                      </div>
                    )}
                    {dayNumber === 20 && (
                      <div className="mt-1 text-xs p-1 bg-amber-50 rounded border border-amber-100 text-amber-800">
                        Pago proveedores
                      </div>
                    )}
                    {dayNumber === 25 && (
                      <div className="mt-1 text-xs p-1 bg-green-50 rounded border border-green-100 text-green-800">
                        Reunión contable
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <AlertCircle className="mr-2 text-red-500" size={18} />
              Obligaciones Urgentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <ComplianceTaskItem 
                title="Declaración mensual de impuestos" 
                dueDate="15/05/2024" 
                category="Fiscal" 
                status="pending" 
                daysLeft={2} 
              />
              <ComplianceTaskItem 
                title="Renovación de licencia de operación" 
                dueDate="22/05/2024" 
                category="Municipal" 
                status="pending" 
                daysLeft={9} 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Clock className="mr-2 text-amber-500" size={18} />
              Próximas Obligaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <ComplianceTaskItem 
                title="Pago de aportes de seguridad social" 
                dueDate="05/06/2024" 
                category="Laboral" 
                status="upcoming" 
                daysLeft={21} 
              />
              <ComplianceTaskItem 
                title="Informe trimestral de actividades" 
                dueDate="10/06/2024" 
                category="Sectorial" 
                status="upcoming" 
                daysLeft={26} 
              />
              <ComplianceTaskItem 
                title="Pago de impuesto predial" 
                dueDate="15/06/2024" 
                category="Municipal" 
                status="upcoming" 
                daysLeft={31} 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Check className="mr-2 text-green-500" size={18} />
              Obligaciones Completadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <ComplianceTaskItem 
                title="Declaración de IVA" 
                dueDate="05/05/2024" 
                category="Fiscal" 
                status="completed" 
                completedDate="04/05/2024" 
              />
              <ComplianceTaskItem 
                title="Reporte de nómina" 
                dueDate="10/05/2024" 
                category="Laboral" 
                status="completed" 
                completedDate="09/05/2024" 
              />
              <ComplianceTaskItem 
                title="Verificación de cumplimiento ambiental" 
                dueDate="30/04/2024" 
                category="Ambiental" 
                status="completed" 
                completedDate="29/04/2024" 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface ComplianceTaskItemProps {
  title: string;
  dueDate: string;
  category: string;
  status: "pending" | "upcoming" | "completed";
  daysLeft?: number;
  completedDate?: string;
}

const ComplianceTaskItem = ({ title, dueDate, category, status, daysLeft, completedDate }: ComplianceTaskItemProps) => {
  return (
    <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex justify-between">
        <div>
          <h4 className="font-medium text-gray-800">{title}</h4>
          <div className="flex items-center text-sm mt-1">
            <span className="text-gray-500 mr-2">Vencimiento: {dueDate}</span>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
              {category}
            </span>
          </div>
        </div>
        <div>
          {status === "completed" && (
            <div className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
              Completado {completedDate}
            </div>
          )}
          {status === "pending" && (
            <div className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
              {daysLeft} días restantes
            </div>
          )}
          {status === "upcoming" && (
            <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
              En {daysLeft} días
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LegalResourcesContent = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Base de Conocimiento Legal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <input 
                  type="text" 
                  placeholder="Buscar recursos legales..." 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-4">
                <LegalResourceItem 
                  title="Guía de Cumplimiento Fiscal para PyMEs en Colombia" 
                  type="Guía" 
                  date="15/03/2024" 
                  downloads={128}
                />
                <LegalResourceItem 
                  title="Plantilla de Contrato Laboral a Término Indefinido" 
                  type="Plantilla" 
                  date="10/02/2024" 
                  downloads={432}
                />
                <LegalResourceItem 
                  title="Regulación de Protección de Datos - Resumen Explicativo" 
                  type="Resumen" 
                  date="05/04/2024" 
                  downloads={87}
                />
                <LegalResourceItem 
                  title="Cambios en la Legislación Tributaria 2024 - Análisis" 
                  type="Análisis" 
                  date="20/01/2024" 
                  downloads={215}
                />
                <LegalResourceItem 
                  title="Checklist de Obligaciones Ambientales por Sector" 
                  type="Checklist" 
                  date="25/03/2024" 
                  downloads={63}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Categorías</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <CategoryItem label="Fiscal" count={24} />
                <CategoryItem label="Laboral" count={18} />
                <CategoryItem label="Comercial" count={15} />
                <CategoryItem label="Ambiental" count={9} />
                <CategoryItem label="Protección al Consumidor" count={7} />
                <CategoryItem label="Propiedad Intelectual" count={5} />
                <CategoryItem label="Importación/Exportación" count={4} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recursos Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm p-2 hover:bg-gray-50 rounded transition-colors">
                  <div className="font-medium">Nuevas Normativas Laborales 2024</div>
                  <div className="text-gray-500">Actualizado: 2 días atrás</div>
                </div>
                <div className="text-sm p-2 hover:bg-gray-50 rounded transition-colors">
                  <div className="font-medium">Guía de Contratación Internacional</div>
                  <div className="text-gray-500">Actualizado: 1 semana atrás</div>
                </div>
                <div className="text-sm p-2 hover:bg-gray-50 rounded transition-colors">
                  <div className="font-medium">Cambios en Regímenes Simplificados</div>
                  <div className="text-gray-500">Actualizado: 2 semanas atrás</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Regulaciones por País</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <CountryRegulationCard 
              country="Colombia" 
              lastUpdated="12/04/2024"
              documentCount={42}
            />
            <CountryRegulationCard 
              country="México" 
              lastUpdated="15/03/2024"
              documentCount={38}
            />
            <CountryRegulationCard 
              country="Perú" 
              lastUpdated="05/04/2024"
              documentCount={31}
            />
            <CountryRegulationCard 
              country="Chile" 
              lastUpdated="22/03/2024"
              documentCount={29}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface LegalResourceItemProps {
  title: string;
  type: string;
  date: string;
  downloads: number;
}

const LegalResourceItem = ({ title, type, date, downloads }: LegalResourceItemProps) => {
  return (
    <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
          <FileText size={18} />
        </div>
        <div>
          <h4 className="font-medium text-gray-800">{title}</h4>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-3">{type}</span>
            <span>Actualizado: {date}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div className="text-sm text-gray-500 mr-4">
          {downloads} descargas
        </div>
        <ButtonCustom variant="outline" size="sm">
          Descargar
        </ButtonCustom>
      </div>
    </div>
  );
};

interface CategoryItemProps {
  label: string;
  count: number;
}

const CategoryItem = ({ label, count }: CategoryItemProps) => {
  return (
    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded transition-colors">
      <span>{label}</span>
      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">{count}</span>
    </div>
  );
};

interface CountryRegulationCardProps {
  country: string;
  lastUpdated: string;
  documentCount: number;
}

const CountryRegulationCard = ({ country, lastUpdated, documentCount }: CountryRegulationCardProps) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
      <h3 className="text-lg font-medium mb-2">{country}</h3>
      <div className="text-sm text-gray-500 mb-3">
        <div>Última actualización: {lastUpdated}</div>
        <div>{documentCount} documentos</div>
      </div>
      <div className="flex justify-between">
        <ButtonCustom variant="ghost" size="sm">
          Explorar
        </ButtonCustom>
        <ButtonCustom variant="outline" size="sm">
          Suscribirse
        </ButtonCustom>
      </div>
    </div>
  );
};

const ProceduresManagementContent = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Trámites en Proceso</h2>
        <ButtonCustom 
          variant="default" 
          size="sm"
          leftIcon={<FilePlus2 size={16} />}
        >
          Nuevo Trámite
        </ButtonCustom>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProcedureCard 
          title="Renovación de Matrícula Mercantil"
          entity="Cámara de Comercio"
          startDate="15/03/2024"
          dueDate="15/05/2024"
          status="En proceso"
          progress={75}
          nextStep="Verificación de documentación"
        />
        
        <ProcedureCard 
          title="Solicitud de Devolución de IVA"
          entity="Dirección de Impuestos"
          startDate="10/04/2024"
          dueDate="10/06/2024"
          status="En espera"
          progress={40}
          nextStep="Respuesta de la autoridad"
        />
        
        <ProcedureCard 
          title="Permiso de Vertimientos"
          entity="Autoridad Ambiental"
          startDate="05/02/2024"
          dueDate="05/07/2024"
          status="En proceso"
          progress={60}
          nextStep="Visita técnica de verificación"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estado de Trámites</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-between mb-6">
            <StatusSummary label="Completados" count={8} color="bg-green-100 text-green-800" />
            <StatusSummary label="En proceso" count={5} color="bg-blue-100 text-blue-800" />
            <StatusSummary label="En espera" count={3} color="bg-amber-100 text-amber-800" />
            <StatusSummary label="Con problemas" count={1} color="bg-red-100 text-red-800" />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trámite</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Inicio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Límite</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Certificado de Uso de Suelo</td>
                  <td className="px-6 py-4 whitespace-nowrap">Planeación Municipal</td>
                  <td className="px-6 py-4 whitespace-nowrap">20/04/2024</td>
                  <td className="px-6 py-4 whitespace-nowrap">20/05/2024</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">En proceso</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ButtonCustom variant="ghost" size="sm">Ver detalles</ButtonCustom>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Licencia de Funcionamiento</td>
                  <td className="px-6 py-4 whitespace-nowrap">Alcaldía Municipal</td>
                  <td className="px-6 py-4 whitespace-nowrap">15/03/2024</td>
                  <td className="px-6 py-4 whitespace-nowrap">15/06/2024</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">En espera</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ButtonCustom variant="ghost" size="sm">Ver detalles</ButtonCustom>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Registro de Marca</td>
                  <td className="px-6 py-4 whitespace-nowrap">Superintendencia de Industria</td>
                  <td className="px-6 py-4 whitespace-nowrap">10/01/2024</td>
                  <td className="px-6 py-4 whitespace-nowrap">10/07/2024</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Con problemas</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ButtonCustom variant="ghost" size="sm">Ver detalles</ButtonCustom>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface ProcedureCardProps {
  title: string;
  entity: string;
  startDate: string;
  dueDate: string;
  status: string;
  progress: number;
  nextStep: string;
}

const ProcedureCard = ({ title, entity, startDate, dueDate, status, progress, nextStep }: ProcedureCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "Completado": return "bg-green-100 text-green-800";
      case "En proceso": return "bg-blue-100 text-blue-800";
      case "En espera": return "bg-amber-100 text-amber-800";
      case "Con problemas": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold">{title}</h3>
        <span className={`px-2 py-1 rounded text-xs ${getStatusColor()}`}>
          {status}
        </span>
      </div>
      
      <div className="text-sm text-gray-600 mb-4">
        <div>Entidad: {entity}</div>
        <div className="flex justify-between mt-1">
          <span>Inicio: {startDate}</span>
          <span>Límite: {dueDate}</span>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>Progreso</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${progress >= 66 ? 'bg-green-500' : progress >= 33 ? 'bg-amber-500' : 'bg-red-500'}`} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="text-sm mb-4">
        <span className="text-gray-600">Próximo paso: </span>
        <span className="font-medium">{nextStep}</span>
      </div>
      
      <ButtonCustom variant="outline" size="sm" className="w-full">
        Ver detalles completos
      </ButtonCustom>
    </div>
  );
};

interface StatusSummaryProps {
  label: string;
  count: number;
  color: string;
}

const StatusSummary = ({ label, count, color }: StatusSummaryProps) => {
  return (
    <div className="flex flex-col items-center mr-4 mb-4">
      <div className={`text-xl font-bold px-4 py-2 rounded ${color}`}>{count}</div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
    </div>
  );
};

export default ComplianceModule;
