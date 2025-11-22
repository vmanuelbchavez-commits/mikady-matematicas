# 📖 Guía Completa de Despliegue

## Paso 1: Configurar Supabase (Base de Datos Gratuita)

1. Ve a https://supabase.com y crea una cuenta
2. Haz clic en "New Project"
3. Completa:
   - Nombre del proyecto: "matematicas-primaria"
   - Contraseña de base de datos (guárdala)
   - Región: South America (más cercana a Perú)
4. Espera 2 minutos mientras se crea el proyecto

### Configurar las Tablas

1. En Supabase, ve a "SQL Editor"
2. Copia y pega el código SQL del README.md
3. Haz clic en "Run" para crear las tablas

### Obtener las Credenciales

1. Ve a "Settings" > "API"
2. Copia:
   - Project URL (VITE_SUPABASE_URL)
   - anon public key (VITE_SUPABASE_ANON_KEY)

## Paso 2: Preparar el Código

1. Crea un archivo `.env` en la raíz del proyecto
2. Pega tus credenciales:
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-aqui
```

## Paso 3: Subir a GitHub

1. Crea cuenta en https://github.com
2. Crea un nuevo repositorio llamado "plataforma-matematicas"
3. En tu terminal:
```bash
git init
git add .
git commit -m "Plataforma de matemáticas inicial"
git branch -M main
git remote add origin https://github.com/tu-usuario/plataforma-matematicas.git
git push -u origin main
```

## Paso 4: Desplegar en Vercel (Hosting Gratuito)

1. Ve a https://vercel.com y crea cuenta con GitHub
2. Haz clic en "Add New Project"
3. Selecciona tu repositorio "plataforma-matematicas"
4. En "Environment Variables" agrega:
   - VITE_SUPABASE_URL: (tu URL de Supabase)
   - VITE_SUPABASE_ANON_KEY: (tu clave de Supabase)
5. Haz clic en "Deploy"
6. Espera 2-3 minutos

¡Listo! Tu plataforma estará en: https://tu-proyecto.vercel.app

## Paso 5: Crear Usuarios para los Alumnos

1. En Supabase, ve a "Authentication" > "Users"
2. Haz clic en "Add user"
3. Ingresa:
   - Email del alumno
   - Contraseña
4. Repite para cada alumno

## Paso 6: Subir Contenido

Para subir archivos (PDFs, videos, etc.):

1. En Supabase, ve a "Storage"
2. Crea un bucket llamado "materiales"
3. Configura como público
4. Sube tus archivos
5. Copia la URL pública
6. En "Table Editor", agrega registros con esas URLs

## 💡 Consejos

- Vercel y Supabase son 100% gratuitos para este uso
- La plataforma estará disponible 24/7
- Puedes actualizar el código y se desplegará automáticamente
- Los límites gratuitos son más que suficientes para una clase
