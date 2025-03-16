
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, CreditCard, BriefcaseBusiness, HandCoins, LandPlot } from "lucide-react";
import { ButtonCustom } from "@/components/ui/button-custom";

const FinancingMarketplace = () => {
  const { toast } = useToast();

  const mockFinancingOptions = [
    {
      type: "Bancos Tradicionales",
      icon: <Building className="h-10 w-10 text-blue-600" />,
      color: "blue",
      entities: [
        { name: "Banco Nacional", rate: "12-15%", amount: "Hasta $2,000,000", term: "1-5 años" },
        { name: "Banco Continental", rate: "11-14%", amount: "Hasta $1,500,000", term: "1-7 años" },
        { name: "Banco Empresarial", rate: "13-16%", amount: "Hasta $3,000,000", term: "1-10 años" },
      ]
    },
    {
      type: "Plataformas Fintech",
      icon: <CreditCard className="h-10 w-10 text-purple-600" />,
      color: "purple",
      entities: [
        { name: "FinCapital", rate: "14-17%", amount: "Hasta $800,000", term: "6 meses-3 años" },
        { name: "CreditTech", rate: "15-18%", amount: "Hasta $500,000", term: "3 meses-2 años" },
        { name: "DigiLoan", rate: "13-16%", amount: "Hasta $1,200,000", term: "1-4 años" },
      ]
    },
    {
      type: "Inversionistas Privados",
      icon: <Users className="h-10 w-10 text-green-600" />,
      color: "green",
      entities: [
        { name: "Growth Capital", rate: "Participación", amount: "Hasta $5,000,000", term: "Variable" },
        { name: "Angel Investors", rate: "Participación", amount: "Hasta $1,000,000", term: "Variable" },
        { name: "Business Partners", rate: "Participación", amount: "Hasta $3,000,000", term: "Variable" },
      ]
    },
    {
      type: "Programas Gubernamentales",
      icon: <Building className="h-10 w-10 text-amber-600" />,
      color: "amber",
      entities: [
        { name: "Fondo PyME", rate: "5-8%", amount: "Hasta $1,000,000", term: "1-7 años" },
        { name: "Impulso Económico", rate: "3-6%", amount: "Hasta $800,000", term: "1-5 años" },
        { name: "Crédito Empresarial", rate: "4-7%", amount: "Hasta $1,500,000", term: "1-8 años" },
      ]
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Marketplace de Financiamiento</h1>
            <p className="text-lg text-pyme-gray-dark max-w-3xl">
              Conectamos tu perfil empresarial con las mejores opciones de financiamiento disponibles en el mercado,
              adaptadas a tus necesidades específicas y métricas financieras reales.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {mockFinancingOptions.map((option, index) => (
              <Card key={index} className={`border-l-4 border-${option.color}-500`}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-${option.color}-100`}>
                      {option.icon}
                    </div>
                    <div>
                      <CardTitle>{option.type}</CardTitle>
                      <CardDescription>
                        {option.type === "Bancos Tradicionales" && "Préstamos y líneas de crédito tradicionales"}
                        {option.type === "Plataformas Fintech" && "Soluciones digitales de financiamiento rápido"}
                        {option.type === "Inversionistas Privados" && "Capital a cambio de participación"}
                        {option.type === "Programas Gubernamentales" && "Apoyo estatal con tasas preferenciales"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {option.entities.map((entity, entityIndex) => (
                      <div key={entityIndex} className="p-4 bg-gray-50 rounded-lg">
                        <div className="font-medium mb-2">{entity.name}</div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500 block">Tasa</span>
                            <span>{entity.rate}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Monto</span>
                            <span>{entity.amount}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Plazo</span>
                            <span>{entity.term}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <ButtonCustom 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                  >
                    Explorar opciones
                  </ButtonCustom>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <BriefcaseBusiness className="mr-2 text-pyme-blue" /> Financiamiento Especial
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex bg-blue-50 p-4 rounded-lg">
                <div className="mr-4">
                  <HandCoins className="h-10 w-10 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Factoraje Financiero</h4>
                  <p className="text-sm text-gray-600 mb-2">Convierte tus facturas por cobrar en efectivo inmediato</p>
                  <div className="text-xs text-blue-800 font-medium">Desde 1.5% mensual</div>
                </div>
              </div>
              
              <div className="flex bg-green-50 p-4 rounded-lg">
                <div className="mr-4">
                  <LandPlot className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Leasing de Equipos</h4>
                  <p className="text-sm text-gray-600 mb-2">Adquiere equipamiento sin comprometer capital</p>
                  <div className="text-xs text-green-800 font-medium">Plazos flexibles de 12-60 meses</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FinancingMarketplace;
