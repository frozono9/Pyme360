
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/api";
import { Database, LayoutDashboard } from "lucide-react";

const DatabaseView = () => {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const user = await api.getCurrentUser();
        if (!user) {
          navigate("/acceso");
          return;
        }
        setUserData(user);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Error al cargar los datos del usuario");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Function to render json data recursively in a readable format
  const renderJsonData = (data: any, level = 0) => {
    if (data === null || data === undefined) return <span className="text-gray-400">null</span>;
    
    if (typeof data !== 'object') {
      // Render primitive values
      if (typeof data === 'string') return <span className="text-green-600">"{data}"</span>;
      if (typeof data === 'number') return <span className="text-blue-600">{data}</span>;
      if (typeof data === 'boolean') return <span className="text-purple-600">{data.toString()}</span>;
      return <span>{String(data)}</span>;
    }
    
    const isArray = Array.isArray(data);
    const padding = level * 20; // Indent based on nesting level
    
    if (Object.keys(data).length === 0) {
      return <span className="text-gray-500">{isArray ? '[]' : '{}'}</span>;
    }

    return (
      <div style={{ paddingLeft: `${padding}px` }}>
        <span className="text-gray-500">{isArray ? '[' : '{'}</span>
        <div className="pl-4">
          {Object.entries(data).map(([key, value], index) => (
            <div key={key} className="flex flex-wrap">
              <span className="text-red-500 font-semibold">{isArray ? index : `"${key}"`}</span>
              <span className="text-gray-500 mx-1">{isArray ? ':' : ' : '}</span>
              {renderJsonData(value, level + 1)}
              {index < Object.keys(data).length - 1 && <span className="text-gray-500">,</span>}
            </div>
          ))}
        </div>
        <span className="text-gray-500">{isArray ? ']' : '}'}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-pyme-blue mb-8">Base de Datos MongoDB</h1>
          
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full max-w-md" />
              <Skeleton className="h-96 w-full" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <Tabs defaultValue="raw" className="w-full">
                <TabsList className="w-full border-b bg-muted/20">
                  <TabsTrigger value="raw" className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <span>Datos Completos</span>
                  </TabsTrigger>
                  <TabsTrigger value="structure" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Estructura de Datos</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="raw" className="p-6 overflow-x-auto">
                  <div className="text-sm font-mono bg-gray-50 p-4 rounded border">
                    {renderJsonData(userData)}
                  </div>
                </TabsContent>
                
                <TabsContent value="structure" className="p-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {userData && Object.keys(userData).map((key) => {
                      if (key === "_id" || key === "password") return null;
                      
                      return (
                        <div key={key} className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-4 py-2 border-b">
                            <h3 className="font-medium">{key}</h3>
                          </div>
                          <div className="p-4 text-sm max-h-60 overflow-y-auto">
                            {typeof userData[key] === 'object' && userData[key] !== null ? (
                              <div className="font-mono text-xs">
                                {renderJsonData(userData[key])}
                              </div>
                            ) : (
                              <p>{String(userData[key])}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DatabaseView;
