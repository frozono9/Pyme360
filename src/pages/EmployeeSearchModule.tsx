
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Search, Filter, Users, User, MapPin, Briefcase, Camera, ImagePlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const EmployeeSearchModule = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter(f => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Espaciador para evitar que el navbar fijo se superponga al contenido */}
      <div className="h-16"></div>
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Búsqueda de Empleados
          </h1>
          <p className="text-gray-600">
            Encuentra el talento ideal para hacer crecer tu negocio
          </p>
        </div>

        {/* Barra de búsqueda */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="Buscar por habilidad, cargo o palabra clave..."
                className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pyme-blue"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-3 top-3 text-gray-400" size={20} />
            </div>
            <ButtonCustom 
              variant="default" 
              className="whitespace-nowrap"
              leftIcon={<Search size={18} />}
            >
              Buscar Candidatos
            </ButtonCustom>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 mr-2 self-center">Filtros:</span>
            {["Tecnología", "Marketing", "Ventas", "Administración", "Finanzas", "Remoto", "Tiempo parcial", "Senior"].map((filter) => (
              <button
                key={filter}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedFilters.includes(filter)
                    ? "bg-pyme-blue text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => toggleFilter(filter)}
              >
                {filter}
              </button>
            ))}
            <button className="px-3 py-1 text-sm rounded-full bg-gray-100 text-pyme-blue hover:bg-pyme-blue/10 flex items-center">
              <Filter size={14} className="mr-1" />
              Más filtros
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Candidatos Recomendados</h2>
                <span className="text-sm text-gray-500">24 perfiles coinciden con tu búsqueda</span>
              </div>
              
              <div className="space-y-4">
                <CandidateCard 
                  name="Ana María Rodríguez"
                  title="Especialista en Marketing Digital"
                  location="Bogotá, Colombia"
                  skills={["SEO", "SEM", "Redes Sociales", "Analítica Web"]}
                  experience={5}
                  matchScore={92}
                  photoUrl="/assets/candidate1.jpg"
                />
                
                <CandidateCard 
                  name="Carlos Eduardo Mendoza"
                  title="Desarrollador Full-Stack"
                  location="Medellín, Colombia (Remoto)"
                  skills={["React", "Node.js", "TypeScript", "MongoDB"]}
                  experience={3}
                  matchScore={88}
                  photoUrl="/assets/candidate2.jpg"
                />
                
                <CandidateCard 
                  name="Laura Sofía Valencia"
                  title="Contadora Senior"
                  location="Cali, Colombia"
                  skills={["Contabilidad NIIF", "Impuestos", "Finanzas", "Auditoría"]}
                  experience={7}
                  matchScore={85}
                  photoUrl=""
                />
                
                <CandidateCard 
                  name="Javier Alejandro Torres"
                  title="Gerente de Ventas"
                  location="Barranquilla, Colombia"
                  skills={["Negociación", "CRM", "Liderazgo", "Desarrollo de Negocios"]}
                  experience={8}
                  matchScore={78}
                  photoUrl=""
                />
              </div>
              
              <div className="mt-6 flex justify-center">
                <ButtonCustom variant="outline">
                  Cargar más resultados
                </ButtonCustom>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 text-pyme-blue" size={18} />
                  Búsquedas Activas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <ActiveJobItem 
                    title="Desarrollador Frontend"
                    applicants={12}
                    isUrgent={true}
                  />
                  <ActiveJobItem 
                    title="Asistente Administrativo"
                    applicants={8}
                    isUrgent={false}
                  />
                  <ActiveJobItem 
                    title="Contador Medio Tiempo"
                    applicants={5}
                    isUrgent={false}
                  />
                </div>
                <ButtonCustom variant="outline" size="sm" className="w-full mt-4">
                  Gestionar vacantes
                </ButtonCustom>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

interface CandidateCardProps {
  name: string;
  title: string;
  location: string;
  skills: string[];
  experience: number;
  matchScore: number;
  photoUrl?: string;
}

const CandidateCard = ({ name, title, location, skills, experience, matchScore, photoUrl }: CandidateCardProps) => {
  const [photo, setPhoto] = useState<string | null>(photoUrl || null);
  
  // Función para manejar la carga de fotos
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex flex-col sm:flex-row">
        <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
          <div className="relative">
            <Avatar className="w-20 h-20">
              {photo ? (
                <AvatarImage src={photo} alt={name} />
              ) : (
                <AvatarFallback className="bg-gray-200 text-gray-500">
                  <User size={24} />
                </AvatarFallback>
              )}
            </Avatar>
            <label 
              htmlFor={`photo-upload-${name}`} 
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-pyme-blue text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-pyme-blue-light transition-colors"
            >
              <Camera size={14} />
              <Input 
                id={`photo-upload-${name}`} 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handlePhotoUpload}
              />
            </label>
          </div>
        </div>
        
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
            <div>
              <div className="flex items-center">
                <h3 className="font-semibold text-lg">{name}</h3>
              </div>
              <p className="text-pyme-blue font-medium">{title}</p>
            </div>
            <div className="mt-2 sm:mt-0 px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-bold">
              {matchScore}% match
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <MapPin size={14} className="mr-1" />
            {location}
            <span className="mx-2">•</span>
            <Briefcase size={14} className="mr-1" />
            {experience} años de experiencia
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map((skill) => (
              <span 
                key={skill} 
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3">
            <ButtonCustom variant="default" size="sm">
              Ver perfil completo
            </ButtonCustom>
            <ButtonCustom variant="outline" size="sm">
              Contactar
            </ButtonCustom>
            <ButtonCustom variant="ghost" size="sm">
              Guardar
            </ButtonCustom>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ActiveJobItemProps {
  title: string;
  applicants: number;
  isUrgent: boolean;
}

const ActiveJobItem = ({ title, applicants, isUrgent }: ActiveJobItemProps) => {
  return (
    <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-gray-600">{applicants} candidatos</p>
        </div>
        {isUrgent && (
          <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs">
            Urgente
          </span>
        )}
      </div>
    </div>
  );
};

export default EmployeeSearchModule;
