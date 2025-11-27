import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Shield, 
  Menu, 
  X, 
  UserPlus, 
  Users, 
  FileText, 
  Search, 
  LogOut, 
  CheckCircle, 
  ChevronRight,
  Bell,
  Calendar,
  MapPin,
  Lock,
  MessageCircle,
  Send,
  Bot,
  Filter,
  Download,
  Award,
  BookOpen,
  Clock,
  ArrowRight,
  BarChart3,
  Map,
  PieChart,
  TrendingUp,
  Activity
} from 'lucide-react';

// --- Types & Mock Data ---

type ViewState = 'home' | 'register' | 'login' | 'dashboard' | 'success' | 'convocations';

interface Aspirante {
  id: string;
  documentType: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  convocation: string;
  status: 'Inscrito' | 'En Proceso' | 'Aprobado' | 'Rechazado';
  registrationDate: string;
  department: string;
}

const DEPARTMENTS = [
  'Bogotá D.C.', 'Antioquia', 'Valle del Cauca', 'Atlántico', 
  'Santander', 'Cundinamarca', 'Bolívar', 'Nariño', 'Tolima', 'Meta'
];

const MOCK_ASPIRANTES: Aspirante[] = [
  { id: '1', documentType: 'CC', documentNumber: '1020304050', firstName: 'Juan Pablo', lastName: 'Rodríguez López', email: 'juan.perez@email.com', phone: '3001234567', convocation: 'Patrullero de Policía', status: 'En Proceso', registrationDate: '2024-05-10', department: 'Bogotá D.C.' },
  { id: '2', documentType: 'TI', documentNumber: '9901010203', firstName: 'María Fernanda', lastName: 'Gómez Díaz', email: 'maria.gomez@email.com', phone: '3109876543', convocation: 'Auxiliar de Policía', status: 'Inscrito', registrationDate: '2024-05-12', department: 'Antioquia' },
  { id: '3', documentType: 'CC', documentNumber: '1030405060', firstName: 'Carlos Andrés', lastName: 'Martínez Ruiz', email: 'carlos.martinez@email.com', phone: '3156789012', convocation: 'Oficial de Policía', status: 'Aprobado', registrationDate: '2024-04-20', department: 'Valle del Cauca' },
  { id: '4', documentType: 'CC', documentNumber: '1011223344', firstName: 'Ana Lucía', lastName: 'Torres Vargas', email: 'ana.torres@email.com', phone: '3205556677', convocation: 'Patrullero de Policía', status: 'Rechazado', registrationDate: '2024-05-01', department: 'Atlántico' },
  { id: '5', documentType: 'CC', documentNumber: '1022334455', firstName: 'Pedro José', lastName: 'Ramírez', email: 'pedro.ramirez@email.com', phone: '3112223344', convocation: 'Patrullero de Policía', status: 'En Proceso', registrationDate: '2024-05-15', department: 'Bogotá D.C.' },
];

const DEPARTMENT_STATS = [
  { name: 'Bogotá D.C.', count: 1250, percentage: 35, color: 'bg-ponal-green' },
  { name: 'Antioquia', count: 850, percentage: 24, color: 'bg-green-600' },
  { name: 'Valle del Cauca', count: 620, percentage: 18, color: 'bg-green-500' },
  { name: 'Atlántico', count: 410, percentage: 12, color: 'bg-green-400' },
  { name: 'Santander', count: 210, percentage: 6, color: 'bg-yellow-500' },
  { name: 'Cundinamarca', count: 150, percentage: 5, color: 'bg-yellow-400' },
];

const CONVOCATION_STATS_DATA = [
  { name: 'Patrullero', count: 2450, percentage: 65, color: 'bg-blue-600' },
  { name: 'Auxiliar', count: 890, percentage: 25, color: 'bg-green-600' },
  { name: 'Oficial', count: 150, percentage: 10, color: 'bg-yellow-500' },
];

const NEWS_ITEMS = [
  { id: 1, title: 'Abiertas inscripciones para Patrulleros 2024', date: '15 May 2024', summary: 'Únete a nuestra institución y sirve al país. Convocatoria nacional abierta hasta el 30 de junio.' },
  { id: 2, title: 'Nuevos beneficios para Auxiliares de Policía', date: '10 May 2024', summary: 'Conoce los nuevos incentivos educativos y económicos para quienes presten su servicio militar.' },
];

const CONVOCATIONS_DATA = [
  {
    id: 'patrullero',
    title: 'Patrullero de Policía',
    subtitle: 'Nivel Ejecutivo',
    description: 'Formación técnica profesional para el servicio de policía comunitario y vigilancia.',
    deadline: '30 de Junio de 2024',
    requirements: [
      'Ser colombiano de nacimiento.',
      'Título de bachiller, técnico o tecnólogo.',
      'Edad: 18 a 27 años (hasta 30 con estudios superiores).',
      'Puntaje ICFES superior a 40 puntos.',
      'No tener antecedentes penales ni disciplinarios.'
    ],
    benefits: ['Estabilidad laboral', 'Seguridad social', 'Posibilidad de ascenso', 'Formación continua'],
    icon: Shield,
    color: 'bg-blue-50 text-blue-700',
    borderColor: 'border-blue-200'
  },
  {
    id: 'auxiliar',
    title: 'Auxiliar de Policía',
    subtitle: 'Servicio Militar',
    description: 'Presta tu servicio militar obligatorio en la Policía Nacional y contribuye a la convivencia.',
    deadline: 'Convocatoria Permanente',
    requirements: [
      'Ser colombiano.',
      'Soltero y sin hijos.',
      'Edad: 18 a 23 años.',
      'No haber sido condenado a penas privativas de la libertad.',
      'Acreditar título de bachiller (opcional).'
    ],
    benefits: ['Bonificación mensual', 'Servicios de salud', 'Tiempo computable para pensión', 'Acceso a becas'],
    icon: Users,
    color: 'bg-green-50 text-green-700',
    borderColor: 'border-green-200'
  },
  {
    id: 'oficial',
    title: 'Profesional Oficial',
    subtitle: 'Nivel Directivo',
    description: 'Para profesionales universitarios que deseen integrar el cuerpo de oficiales de la institución.',
    deadline: '15 de Julio de 2024',
    requirements: [
      'Título profesional universitario en carreras convocadas.',
      'Edad: Hasta 30 años (o 35 con postgrado).',
      'Promedio académico superior a 3.8.',
      'Tarjeta profesional vigente.',
      'Certificación de idioma extranjero (B1).'
    ],
    benefits: ['Carrera directiva', 'Formación de postgrado', 'Comisiones al exterior', 'Vivienda fiscal'],
    icon: Award,
    color: 'bg-yellow-50 text-yellow-700',
    borderColor: 'border-yellow-200'
  }
];

// --- Components ---

const Button = ({ children, variant = 'primary', className = '', onClick, type = 'button' }: any) => {
  const baseStyle = "px-5 py-2.5 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center";
  const variants = {
    primary: "bg-ponal-green text-white hover:bg-green-800 focus:ring-green-600",
    secondary: "bg-ponal-dark text-white hover:bg-slate-800 focus:ring-slate-600",
    outline: "border border-ponal-green text-ponal-green hover:bg-green-50 focus:ring-green-600",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-ponal-dark",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  };
  
  return (
    <button type={type} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

const ColombiaMap = () => {
  // Coordenadas calibradas para el nuevo mapa (ViewBox 0 0 400 500)
  const locations = [
    { name: 'Bogotá D.C.', x: 195, y: 220, count: 1250, percent: 35 },
    { name: 'Antioquia', x: 165, y: 160, count: 850, percent: 24 },
    { name: 'Valle del Cauca', x: 135, y: 245, count: 620, percent: 18 },
    { name: 'Atlántico', x: 175, y: 40, count: 410, percent: 12 },
    { name: 'Santander', x: 210, y: 145, count: 210, percent: 6 },
    { name: 'Meta', x: 230, y: 250, count: 150, percent: 5 },
  ];

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center bg-blue-50/50 rounded-xl overflow-hidden border border-gray-100">
      <svg
        viewBox="0 0 400 500"
        className="w-full h-full max-h-[450px]"
        style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.05))' }}
      >
        <defs>
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3f4f6" />
            <stop offset="100%" stopColor="#e5e7eb" />
          </linearGradient>
        </defs>
        
        {/* Mapa Geográfico de Colombia */}
        <path
          d="M178.6,15.6 C183.1,13.8 195.4,12.5 200.2,16.4 C205,20.3 218.4,24.8 221.3,30.1 C224.2,35.4 220.8,47.9 216.5,52.3 C212.2,56.7 207.9,59.2 212.2,65.3 C216.5,71.4 228.6,83.9 231.9,88.7 C235.2,93.5 242.4,103.1 245.3,114.2 C248.2,125.3 243.9,139.7 245.3,143.5 C246.7,147.3 255.4,157.4 263.1,164.6 C270.8,171.8 281.3,178.5 284.7,184.8 C288.1,191.1 292.8,202.1 292.8,210.7 C292.8,219.3 285.6,231.3 283.7,238.1 C281.8,244.9 288.1,262.6 289.5,269.8 C290.9,277 285.6,293.8 289.5,301.9 C293.4,310.1 292.4,319.2 284.7,329.8 C277,340.4 256.4,364.4 251.6,368.7 C246.8,373 230,378.8 219.9,376.9 C209.8,375 194.5,368.3 190.2,360.6 C185.9,352.9 174.8,345.2 170.5,342.3 C166.2,339.4 153.2,333.7 150.8,327 C148.4,320.3 145.1,311.6 140.3,303 C135.5,294.4 130.7,281.4 128.8,274.2 C126.9,267 119.7,250.7 116.8,243.5 C113.9,236.3 105.3,212.8 102.4,204.6 C99.5,196.4 92.8,187.3 90.9,180.1 C89,172.9 94.7,163.8 98.6,155.6 C102.4,147.4 104.3,138.3 108.2,130.2 C112.1,122.1 114.9,114.4 118.8,111.5 C122.7,108.6 130.8,107.7 134.7,102.9 C138.6,98.1 133.3,90.4 131.9,84.1 C130.5,77.9 135.3,64.9 140.5,58.7 C145.7,52.5 155.4,38.5 161.6,29.9 C167.8,21.3 174.1,17.4 178.6,15.6 Z"
          fill="url(#mapGradient)"
          stroke="#cbd5e1"
          strokeWidth="1.5"
          className="hover:stroke-ponal-green transition-colors duration-500 hover:fill-gray-200"
        />
        
        {/* Render markers */}
        {locations.map((loc, idx) => {
          // Scale circle size based on percentage, min 4 max 12
          const radius = Math.max(4, Math.min(12, loc.percent / 2));
          
          return (
            <g key={idx} className="group cursor-pointer">
              {/* Pulse effect */}
              <circle cx={loc.x} cy={loc.y} r={radius * 1.5} className="fill-ponal-green opacity-20 animate-ping origin-center" />
              {/* Main Dot */}
              <circle 
                cx={loc.x} 
                cy={loc.y} 
                r={radius} 
                className="fill-ponal-green stroke-white stroke-1 hover:fill-green-700 transition-colors"
              />
              {/* Tooltip (SVG based) - Visible on hover */}
              <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <rect x={loc.x + 10} y={loc.y - 25} width="120" height="40" rx="4" fill="white" className="shadow-lg drop-shadow-md" />
                <text x={loc.x + 18} y={loc.y - 10} className="text-[10px] font-bold fill-gray-800">{loc.name}</text>
                <text x={loc.x + 18} y={loc.y + 5} className="text-[9px] fill-gray-500">{loc.count} Aspirantes</text>
              </g>
            </g>
          );
        })}
      </svg>
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-xs p-2 rounded shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-ponal-green"></span> Alta demanda
        </div>
         <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-300"></span> Baja demanda
        </div>
      </div>
    </div>
  );
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string, isUser: boolean }[]>([
    { text: "¡Hola! Soy el asistente virtual de Incorporación. ¿En qué puedo ayudarte hoy?", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue;
    setMessages(prev => [...prev, { text: userMsg, isUser: true }]);
    setInputValue("");
    
    // Simulate response logic
    setTimeout(() => {
      let response = "Gracias por tu consulta. Un asesor revisará tu caso si es necesario.";
      const lowerMsg = userMsg.toLowerCase();
      
      if (lowerMsg.includes("hola") || lowerMsg.includes("buenos")) {
        response = "¡Hola! Bienvenido al sistema SINCO. Estoy aquí para resolver tus dudas sobre el proceso de incorporación.";
      } else if (lowerMsg.includes("fecha") || lowerMsg.includes("cuándo")) {
        response = "Las fechas de convocatoria varían según el programa. Actualmente tenemos inscripciones abiertas hasta el 30 de junio para Patrulleros.";
      } else if (lowerMsg.includes("documento") || lowerMsg.includes("requisito")) {
        response = "Los documentos básicos son: Cédula de ciudadanía, Diploma de bachiller y resultados ICFES. Recuerda que todo se carga digitalmente en el paso 2.";
      } else if (lowerMsg.includes("edad") || lowerMsg.includes("años")) {
        response = "Para patrulleros la edad es entre 18 y 27 años (hasta 30 con estudios técnicos/tecnológicos). Para auxiliares es entre 18 y 23 años.";
      } else if (lowerMsg.includes("costo") || lowerMsg.includes("pagar")) {
        response = "La pre-inscripción en el sistema es totalmente gratuita. Los costos posteriores corresponden a las carpetas y exámenes médicos.";
      }
      
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    }, 800);
  };

  return (
    <>
      {/* Chat Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-ponal-green text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all hover:scale-105 z-50 flex items-center justify-center animate-bounce-slow ring-4 ring-white"
          aria-label="Abrir chat de soporte"
        >
          <MessageCircle className="h-7 w-7" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-xl shadow-2xl z-50 overflow-hidden border border-gray-200 flex flex-col h-[500px] animate-fade-in-up">
          {/* Header */}
          <div className="bg-ponal-green text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                 <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Asistente SINCO</h3>
                <p className="text-xs text-green-100 flex items-center mt-0.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span> En línea
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 rounded-full p-1.5 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-4">
             {messages.map((msg, idx) => (
               <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[85%] rounded-2xl p-3.5 text-sm shadow-sm ${
                   msg.isUser 
                     ? 'bg-ponal-green text-white rounded-tr-sm' 
                     : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                 }`}>
                   {msg.text}
                 </div>
               </div>
             ))}
             <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex space-x-2">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu consulta..."
                className="flex-grow border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ponal-green focus:border-transparent transition-all"
              />
              <button 
                onClick={handleSend} 
                className="bg-ponal-dark text-white p-2.5 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50"
                disabled={!inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="text-center mt-2">
              <p className="text-[10px] text-gray-400">SINCO Chat - Policía Nacional</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Header = ({ setView, isLoggedIn, setIsLoggedIn, userRole }: any) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-ponal-green text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo Area */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-white p-1.5 rounded-full">
            <Shield className="h-8 w-8 text-ponal-green" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">SINCO</h1>
            <p className="text-xs text-green-100 opacity-90 tracking-wider">POLICÍA NACIONAL</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1">
          <Button variant="ghost" className="text-white hover:text-white hover:bg-green-700" onClick={() => setView('home')}>Inicio</Button>
          <Button variant="ghost" className="text-white hover:text-white hover:bg-green-700" onClick={() => setView('convocations')}>Convocatorias</Button>
          <Button variant="ghost" className="text-white hover:text-white hover:bg-green-700" onClick={() => setView('register')}>Pre-Inscripción</Button>
          
          <div className="h-6 w-px bg-green-600 mx-2"></div>
          
          {isLoggedIn ? (
            <div className="flex items-center space-x-3 ml-2">
              <span className="text-sm font-medium bg-green-800 px-3 py-1 rounded-full">{userRole}</span>
              <Button variant="secondary" className="text-sm py-1.5 px-3" onClick={() => { setIsLoggedIn(false); setView('home'); }}>
                <LogOut className="h-4 w-4 mr-1 inline" /> Salir
              </Button>
            </div>
          ) : (
            <Button variant="secondary" className="ml-2 text-sm shadow-md" onClick={() => setView('login')}>
              Funcionarios
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-white hover:bg-green-700 rounded-md">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-green-800 py-2 border-t border-green-700">
          <div className="container mx-auto px-4 flex flex-col space-y-2">
            <button className="text-left py-2 px-3 text-white hover:bg-green-700 rounded" onClick={() => { setView('home'); setIsMenuOpen(false); }}>Inicio</button>
            <button className="text-left py-2 px-3 text-white hover:bg-green-700 rounded" onClick={() => { setView('convocations'); setIsMenuOpen(false); }}>Convocatorias</button>
            <button className="text-left py-2 px-3 text-white hover:bg-green-700 rounded" onClick={() => { setView('register'); setIsMenuOpen(false); }}>Pre-Inscripción</button>
            <button className="text-left py-2 px-3 text-white hover:bg-green-700 rounded" onClick={() => { setView('login'); setIsMenuOpen(false); }}>Acceso Funcionarios</button>
          </div>
        </div>
      )}
    </header>
  );
};

const Footer = () => (
  <footer className="bg-ponal-dark text-gray-300 py-10 mt-auto">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="h-6 w-6 text-white" />
          <span className="font-bold text-white text-lg">SINCO</span>
        </div>
        <p className="mb-4">Sistema de Información de Incorporación.</p>
        <p className="text-xs text-gray-500">
          &copy; 2024 Policía Nacional de Colombia. <br/>Todos los derechos reservados.
        </p>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-3 border-b border-gray-700 pb-2 inline-block">Enlaces de Interés</h3>
        <ul className="space-y-2">
          <li><a href="#" className="hover:text-ponal-green transition-colors">Política de Tratamiento de Datos</a></li>
          <li><a href="#" className="hover:text-ponal-green transition-colors">Términos y Condiciones</a></li>
          <li><a href="#" className="hover:text-ponal-green transition-colors">Página Oficial Policía Nacional</a></li>
        </ul>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-3 border-b border-gray-700 pb-2 inline-block">Contacto</h3>
        <ul className="space-y-2">
          <li className="flex items-start"><MapPin className="h-4 w-4 mr-2 mt-1 text-ponal-green" /> Carrera 59 No. 26-21 CAN, Bogotá</li>
          <li className="flex items-center"><UserPlus className="h-4 w-4 mr-2 text-ponal-green" /> Línea Gratuita: 018000-910-112</li>
        </ul>
      </div>
    </div>
  </footer>
);

const ConvocatoriasView = ({ setView }: any) => {
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header Banner */}
      <div className="bg-ponal-dark text-white py-12 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-4 text-green-400 text-sm font-bold tracking-wider uppercase">
            <Award className="h-4 w-4 mr-2" /> Oportunidades Laborales
          </div>
          <h1 className="text-4xl font-bold mb-4">Convocatorias Vigentes</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Consulta los requisitos, fechas y beneficios de cada modalidad de incorporación y elige tu camino en la Policía Nacional.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {CONVOCATIONS_DATA.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col hover:shadow-xl transition-shadow duration-300">
              {/* Card Header */}
              <div className={`p-6 ${item.color} border-b ${item.borderColor}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <item.icon className="h-8 w-8" />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-800 border border-gray-200 shadow-sm">
                     <Clock className="h-3 w-3 mr-1" /> {item.deadline}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-1">{item.title}</h3>
                <p className="opacity-90 font-medium">{item.subtitle}</p>
              </div>

              {/* Content */}
              <div className="p-6 flex-grow">
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  {item.description}
                </p>

                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-ponal-green" /> Requisitos Básicos
                  </h4>
                  <ul className="space-y-2">
                    {item.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-300 mt-1.5 mr-2 flex-shrink-0"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                   <h4 className="font-bold text-gray-900 mb-3 flex items-center text-sm">
                    <Award className="h-4 w-4 mr-2 text-yellow-600" /> Beneficios
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {item.benefits.map((ben, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                        {ben}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Action */}
              <div className="p-6 bg-gray-50 border-t border-gray-100 mt-auto">
                <Button className="w-full justify-center" onClick={() => setView('register')}>
                  Iniciar Pre-Inscripción <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-blue-50 rounded-xl p-8 border border-blue-100 flex flex-col md:flex-row items-center gap-6">
          <div className="bg-blue-100 p-4 rounded-full text-blue-600">
            <BookOpen className="h-8 w-8" />
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-bold text-blue-900 mb-2">¿Tienes dudas sobre el proceso?</h3>
            <p className="text-blue-800 text-sm">
              Consulta nuestra guía detallada de paso a paso, preguntas frecuentes y documentación requerida para cada etapa del proceso de selección.
            </p>
          </div>
          <Button variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-100 whitespace-nowrap">
            Descargar Guía PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

const HomeView = ({ setView }: any) => (
  <main className="flex-grow">
    {/* Hero Section */}
    <section className="relative bg-ponal-dark h-[500px] flex items-center justify-center overflow-hidden">
      {/* Updated Background Image: Showing formation/citizens/incorporation context */}
      <div className="absolute inset-0 bg-[url('https://www.policia.gov.co/sites/default/files/styles/16_9/public/2021-12/incorporacion.jpg')] bg-cover bg-center opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-ponal-dark via-transparent to-transparent"></div>
      <div className="relative container mx-auto px-4 text-center text-white z-10">
        <span className="inline-block py-1 px-3 rounded-full bg-green-600/30 border border-green-500 text-green-300 text-sm font-semibold tracking-wide mb-4 backdrop-blur-sm">
          PROCESO DE INCORPORACIÓN 2024
        </span>
        <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight drop-shadow-lg">
          DIOS Y PATRIA
        </h2>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-200 font-light">
          Construye tu futuro sirviendo a la comunidad. Únete a la Policía Nacional.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button onClick={() => setView('register')} className="text-lg px-8 py-4 shadow-xl transform hover:scale-105 transition-transform">
            Inscríbete Ahora
          </Button>
          <Button variant="outline" onClick={() => setView('convocations')} className="text-lg px-8 py-4 border-white text-white hover:bg-white/10 hover:text-white backdrop-blur-sm">
            Ver Requisitos
          </Button>
        </div>
      </div>
    </section>

    {/* Convocatorias Activas (Preview) */}
    <section className="py-16 container mx-auto px-4">
      <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-4">
        <div>
          <h3 className="text-2xl font-bold text-ponal-dark">Convocatorias Destacadas</h3>
          <p className="text-gray-500 mt-1">Selecciona tu perfil y comienza el proceso</p>
        </div>
        <button onClick={() => setView('convocations')} className="text-ponal-green font-medium hover:underline flex items-center">
          Ver todas <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Patrullero de Policía", desc: "Bachilleres, Técnicos o Tecnólogos.", icon: Shield, color: "bg-blue-50 text-blue-700" },
          { title: "Auxiliar de Policía", desc: "Servicio militar obligatorio.", icon: Users, color: "bg-green-50 text-green-700" },
          { title: "Profesional Oficial", desc: "Profesionales de carreras convocadas.", icon: FileText, color: "bg-yellow-50 text-yellow-700" }
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-6 flex flex-col items-start group">
            <div className={`p-3 rounded-lg ${item.color} mb-4 group-hover:scale-110 transition-transform`}>
              <item.icon className="h-8 w-8" />
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h4>
            <p className="text-gray-600 mb-6 flex-grow">{item.desc}</p>
            <Button variant="outline" className="w-full justify-between flex items-center group-hover:bg-ponal-green group-hover:text-white group-hover:border-ponal-green" onClick={() => setView('convocations')}>
              Ver Detalles <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </section>

    {/* News Section */}
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold text-ponal-dark mb-8 text-center">Noticias de Incorporación</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {NEWS_ITEMS.map((news) => (
            <div key={news.id} className="flex flex-col md:flex-row bg-gray-50 rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="md:w-1/3 bg-gray-200 min-h-[150px] md:min-h-0 flex items-center justify-center">
                <Shield className="h-12 w-12 text-gray-400" />
              </div>
              <div className="p-6 md:w-2/3">
                <div className="flex items-center text-xs text-ponal-green font-semibold mb-2">
                  <Calendar className="h-3 w-3 mr-1" /> {news.date}
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2 leading-snug">{news.title}</h4>
                <p className="text-sm text-gray-600 mb-4">{news.summary}</p>
                <a href="#" className="text-sm font-medium text-ponal-dark hover:text-ponal-green underline decoration-green-400 decoration-2 underline-offset-4">Leer más</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </main>
);

const RegistrationForm = ({ setView, addAspirante }: any) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    documentType: 'CC',
    documentNumber: '',
    email: '',
    phone: '',
    convocation: 'Patrullero de Policía',
    department: 'Bogotá D.C.',
    terms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      addAspirante(formData);
      setView('success');
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl w-full space-y-8 bg-white p-10 rounded-xl shadow-xl border-t-4 border-ponal-green">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-ponal-green" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Pre-Inscripción SINCO</h2>
          <p className="text-sm text-gray-600 mt-2">
            Diligencia el formulario con información verídica para iniciar tu proceso.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="convocation" className="block text-sm font-medium text-gray-700">Convocatoria de Interés</label>
              <select
                id="convocation"
                name="convocation"
                required
                className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-ponal-green focus:border-ponal-green sm:text-sm rounded-md border"
                value={formData.convocation}
                onChange={handleChange}
              >
                <option>Patrullero de Policía</option>
                <option>Auxiliar de Policía</option>
                <option>Profesional Oficial</option>
              </select>
            </div>

            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Nombres</label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                required
                className="mt-1 focus:ring-ponal-green focus:border-ponal-green block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellidos</label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                required
                className="mt-1 focus:ring-ponal-green focus:border-ponal-green block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">Tipo de Documento</label>
              <select
                id="documentType"
                name="documentType"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-ponal-green focus:border-ponal-green sm:text-sm"
                value={formData.documentType}
                onChange={handleChange}
              >
                <option>CC - Cédula de Ciudadanía</option>
                <option>TI - Tarjeta de Identidad</option>
                <option>CE - Cédula de Extranjería</option>
              </select>
            </div>

            <div>
              <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700">Número de Documento</label>
              <input
                type="text"
                name="documentNumber"
                id="documentNumber"
                required
                className="mt-1 focus:ring-ponal-green focus:border-ponal-green block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                value={formData.documentNumber}
                onChange={handleChange}
              />
            </div>

             <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">Departamento de Residencia</label>
              <select
                id="department"
                name="department"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-ponal-green focus:border-ponal-green sm:text-sm"
                value={formData.department}
                onChange={handleChange}
              >
                {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="mt-1 focus:ring-ponal-green focus:border-ponal-green block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono Móvil</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                required
                className="mt-1 focus:ring-ponal-green focus:border-ponal-green block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="focus:ring-ponal-green h-4 w-4 text-ponal-green border-gray-300 rounded"
                checked={formData.terms}
                onChange={handleChange}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700">Acepto términos y condiciones</label>
              <p className="text-gray-500">Autorizo el tratamiento de mis datos personales según la política institucional.</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button variant="ghost" className="w-full" onClick={() => setView('home')}>Cancelar</Button>
            <Button type="submit" className="w-full">Registrar Aspirante</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SuccessView = ({ setView }: any) => (
  <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 text-center border-t-4 border-ponal-green">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Registro Exitoso!</h2>
        <p className="text-gray-600 mb-6">
          Tus datos han sido registrados correctamente en el sistema SINCO. Recibirás un correo con los pasos a seguir.
        </p>
        <div className="bg-blue-50 p-4 rounded-md mb-6 text-left">
          <h4 className="text-sm font-bold text-blue-800 mb-1">Siguientes pasos:</h4>
          <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
            <li>Revisa tu correo electrónico.</li>
            <li>Prepara tu documentación física.</li>
            <li>Espera la notificación para pruebas físicas.</li>
          </ul>
        </div>
        <Button className="w-full" onClick={() => setView('home')}>Volver al Inicio</Button>
      </div>
    </div>
  </div>
);

const LoginView = ({ setView, setIsLoggedIn }: any) => {
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    setTimeout(() => {
      setIsLoggedIn(true);
      setView('dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-ponal-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-white p-2 rounded-full">
            <Shield className="h-10 w-10 text-ponal-green" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">SINCO</h2>
        <p className="mt-2 text-center text-sm text-gray-400">Acceso exclusivo para funcionarios</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Usuario SIGON</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserPlus className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" className="focus:ring-ponal-green focus:border-ponal-green block w-full pl-10 sm:text-sm border-gray-300 rounded-md border py-2" placeholder="usuario.policia" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input type="password" className="focus:ring-ponal-green focus:border-ponal-green block w-full pl-10 sm:text-sm border-gray-300 rounded-md border py-2" placeholder="••••••••" />
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full flex justify-center">Ingresar</Button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Sistema Seguro</span>
              </div>
            </div>
            <div className="mt-4 text-center text-xs text-gray-500">
              El acceso no autorizado a este sistema es un delito informático.
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <button onClick={() => setView('home')} className="text-gray-400 hover:text-white text-sm font-medium">Volver al portal público</button>
        </div>
      </div>
    </div>
  );
};

const DashboardView = ({ aspirantes }: { aspirantes: Aspirante[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [activeTab, setActiveTab] = useState<'aspirantes' | 'analytics'>('analytics');

  const filteredAspirantes = aspirantes.filter(a => {
    const matchesSearch = 
      a.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.documentNumber.includes(searchTerm);
    const matchesStatus = filterStatus === 'Todos' || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Inscrito': return 'bg-blue-100 text-blue-800';
      case 'En Proceso': return 'bg-yellow-100 text-yellow-800';
      case 'Aprobado': return 'bg-green-100 text-green-800';
      case 'Rechazado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-bold text-ponal-dark">Panel de Control DINCO</h2>
           <p className="text-gray-500">Gestión estratégica de incorporaciones.</p>
        </div>
        <div className="flex space-x-2 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center ${activeTab === 'analytics' ? 'bg-ponal-green text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <BarChart3 className="w-4 h-4 mr-2" /> Análisis Estratégico
          </button>
          <button 
            onClick={() => setActiveTab('aspirantes')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center ${activeTab === 'aspirantes' ? 'bg-ponal-green text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Users className="w-4 h-4 mr-2" /> Gestión Operativa
          </button>
        </div>
      </div>

      {activeTab === 'analytics' ? (
        <div className="space-y-6 animate-fade-in-up">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Total Inscritos Nacional', value: '3,452', sub: '+12% vs mes anterior', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Convocatorias Activas', value: '3', sub: 'Cierre próximo: 30 Jun', icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Tasa de Aprobación', value: '18.5%', sub: 'En fase preliminar', icon: TrendingUp, color: 'text-yellow-600', bg: 'bg-yellow-50' },
              { label: 'Departamentos Activos', value: '32', sub: 'Cobertura nacional 100%', icon: Map, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white overflow-hidden shadow rounded-lg p-5 border border-gray-100">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.label}</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stat.value}</dd>
                    <dd className="text-xs text-gray-400 mt-1">{stat.sub}</dd>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map / Geography Section */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-ponal-green" /> Distribución Geográfica de Inscripciones
                </h3>
                <button className="text-sm text-ponal-green font-medium hover:underline">Ver mapa completo</button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8">
                 {/* Visual Map Component */}
                 <div className="flex-1">
                    <ColombiaMap />
                    <p className="mt-4 text-center text-sm text-gray-500 font-medium">Mapa de Calor - Inscripciones Activas</p>
                 </div>

                 {/* Stats List */}
                 <div className="flex-1 space-y-5">
                    {DEPARTMENT_STATS.map((dept, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">{dept.name}</span>
                          <span className="text-gray-500">{dept.count} asp. ({dept.percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div className={`${dept.color} h-2.5 rounded-full`} style={{ width: `${dept.percentage}%` }}></div>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-400">Datos actualizados en tiempo real desde las regionales de incorporación.</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-ponal-green" /> Participación
              </h3>
              
              <div className="flex-grow flex flex-col justify-center space-y-8">
                 {CONVOCATION_STATS_DATA.map((item, idx) => (
                   <div key={idx} className="relative">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-gray-800">{item.name}</span>
                        <span className="text-sm font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-600">{item.count}</span>
                      </div>
                      <div className="w-full bg-gray-100 h-4 rounded-md overflow-hidden flex">
                        <div className={`${item.color} h-full`} style={{ width: `${item.percentage}%` }}></div>
                      </div>
                      <div className="mt-1 text-xs text-gray-400 text-right">{item.percentage}% del total</div>
                   </div>
                 ))}
              </div>

              <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-bold text-blue-900 text-sm mb-1">Análisis Rápido</h4>
                <p className="text-xs text-blue-800">
                  La convocatoria de <strong>Patrulleros</strong> lidera la intención de ingreso con un 65%, concentrándose principalmente en la región central del país.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Operational Management Table (Existing) */
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 animate-fade-in-up">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="w-full sm:w-auto">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Aspirantes Registrados</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Lista completa de ciudadanos en proceso.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative rounded-md shadow-sm max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-ponal-green focus:border-ponal-green block w-full pl-10 sm:text-sm border-gray-300 rounded-md border py-2"
                  placeholder="Buscar por cédula o nombre"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
                <select 
                  className="focus:ring-ponal-green focus:border-ponal-green block w-full pl-10 sm:text-sm border-gray-300 rounded-md border py-2 pr-8"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="Todos">Todos los estados</option>
                  <option value="Inscrito">Inscrito</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Aprobado">Aprobado</option>
                  <option value="Rechazado">Rechazado</option>
                </select>
              </div>
              <Button variant="outline" className="flex items-center">
                <Download className="h-4 w-4 mr-2" /> Exportar
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aspirante</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Convocatoria</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Editar</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAspirantes.map((person) => (
                  <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-ponal-green text-white flex items-center justify-center font-bold">
                          {person.firstName.charAt(0)}{person.lastName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{person.firstName} {person.lastName}</div>
                          <div className="text-sm text-gray-500">{person.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{person.documentType} {person.documentNumber}</div>
                      <div className="text-sm text-gray-500">{person.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" /> {person.department || 'Bogotá D.C.'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{person.convocation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {person.registrationDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(person.status)}`}>
                        {person.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href="#" className="text-ponal-green hover:text-green-900">Gestionar</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredAspirantes.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No se encontraron aspirantes con los filtros seleccionados.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [view, setView] = useState<ViewState>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [aspirantes, setAspirantes] = useState<Aspirante[]>(MOCK_ASPIRANTES);

  const addAspirante = (data: any) => {
    const newAspirante: Aspirante = {
      id: (aspirantes.length + 1).toString(),
      ...data,
      status: 'Inscrito',
      registrationDate: new Date().toISOString().split('T')[0]
    };
    setAspirantes([...aspirantes, newAspirante]);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      {view !== 'login' && view !== 'dashboard' && (
        <Header 
          setView={setView} 
          isLoggedIn={isLoggedIn} 
          setIsLoggedIn={setIsLoggedIn}
          userRole="Admin. Incorporación" 
        />
      )}
      
      {/* Admin Header override */}
      {view === 'dashboard' && (
         <Header 
          setView={setView} 
          isLoggedIn={isLoggedIn} 
          setIsLoggedIn={setIsLoggedIn}
          userRole="Admin. Incorporación" 
        />
      )}

      {view === 'home' && <HomeView setView={setView} />}
      {view === 'convocations' && <ConvocatoriasView setView={setView} />}
      {view === 'register' && <RegistrationForm setView={setView} addAspirante={addAspirante} />}
      {view === 'login' && <LoginView setView={setView} setIsLoggedIn={setIsLoggedIn} />}
      {view === 'dashboard' && <DashboardView aspirantes={aspirantes} />}
      {view === 'success' && <SuccessView setView={setView} />}

      {view !== 'login' && view !== 'dashboard' && <Footer />}
      
      {/* Public Chatbot - Hidden in dashboard/login */}
      {(view === 'home' || view === 'register' || view === 'convocations' || view === 'success') && <ChatBot />}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);