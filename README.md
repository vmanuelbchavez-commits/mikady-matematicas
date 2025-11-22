# 🎓 Plataforma Mikady - Matemáticas

Plataforma educativa para clases de matemáticas de primaria (1º-3º) con panel de administración completo.

## 📋 Características

- ✅ Sistema de autenticación seguro
- 👩‍🏫 **Panel de administración completo** para la profesora
- 📚 Gestión de clases del colegio por grado (1º, 2º, 3º primaria)
- 👨‍🏫 Gestión de clases particulares con enlaces a videollamadas
- 📝 Gestión de ejercicios prácticos
- 👥 Creación de usuarios para alumnos desde el panel
- 📥 Subida de archivos (PDF, imágenes) directamente desde la web
- 📋 Sistema de anotaciones personales para alumnos

## 🚀 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar Supabase:
   - Crear cuenta en https://supabase.com
   - Crear nuevo proyecto
   - Copiar `.env.example` a `.env`
   - Agregar las credenciales de Supabase

3. Ejecutar en desarrollo:
```bash
npm run dev
```

## 🗄️ Configuración de Base de Datos (Supabase)

Ejecutar estos comandos SQL en Supabase:

```sql
-- Tabla de clases del colegio
CREATE TABLE clases_colegio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  grado TEXT NOT NULL,
  archivo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de clases particulares
CREATE TABLE clases_particulares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  link_clase TEXT,
  archivo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de ejercicios
CREATE TABLE ejercicios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  nivel TEXT,
  tema TEXT,
  archivo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de anotaciones
CREATE TABLE anotaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  contenido TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE clases_colegio ENABLE ROW LEVEL SECURITY;
ALTER TABLE clases_particulares ENABLE ROW LEVEL SECURITY;
ALTER TABLE ejercicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE anotaciones ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso
CREATE POLICY "Todos pueden ver clases del colegio" ON clases_colegio FOR SELECT USING (true);
CREATE POLICY "Todos pueden ver clases particulares" ON clases_particulares FOR SELECT USING (true);
CREATE POLICY "Todos pueden ver ejercicios" ON ejercicios FOR SELECT USING (true);
CREATE POLICY "Usuarios pueden ver sus anotaciones" ON anotaciones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuarios pueden crear anotaciones" ON anotaciones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuarios pueden eliminar sus anotaciones" ON anotaciones FOR DELETE USING (auth.uid() = user_id);
```

## 📦 Despliegue en Vercel

1. Crear cuenta en https://vercel.com
2. Conectar tu repositorio de GitHub
3. Agregar variables de entorno en Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Desplegar

## 👩‍🏫 Panel de Administración

La profesora puede gestionar TODO desde la plataforma web:
- Subir y eliminar clases del colegio
- Crear clases particulares con enlaces de Zoom/Meet
- Subir ejercicios prácticos
- Crear usuarios para alumnos
- Todo con interfaz visual, sin tocar código ni Supabase

## 📱 Uso

**Para la profesora:**
- Ingresa con su email de administrador
- Ve automáticamente el panel de administración
- Gestiona todo desde ahí

**Para los alumnos:**
- Ingresan con su email y contraseña
- Acceden a materiales según su grado
- Ven clases particulares y se unen a videollamadas
- Descargan y practican ejercicios
- Guardan notas personales

## 📚 Documentación

- `CONFIGURACION_STORAGE.md` - Configuración inicial de Supabase
- `GUIA_USO_PROFESORA.md` - Guía simple para la profesora
- `GUIA_DESPLIEGUE_SIN_GIT.md` - Despliegue sin instalar nada
