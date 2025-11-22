# 🚀 Guía de Despliegue SIN instalar nada

## Paso 1: Crear cuenta en GitHub

1. Ve a https://github.com
2. Haz clic en "Sign up"
3. Crea tu cuenta (usa tu email)
4. Verifica tu email

## Paso 2: Crear repositorio en GitHub

1. Una vez dentro de GitHub, haz clic en el botón verde "New" (arriba a la izquierda)
2. Nombre del repositorio: `plataforma-matematicas`
3. Descripción: "Plataforma educativa de matemáticas"
4. Selecciona "Public"
5. NO marques ninguna casilla (README, .gitignore, etc.)
6. Haz clic en "Create repository"

## Paso 3: Subir archivos a GitHub

1. En la página del repositorio vacío, verás "uploading an existing file"
2. Haz clic en ese enlace
3. Arrastra TODA la carpeta del proyecto (todos los archivos y carpetas)
4. Espera a que se suban todos los archivos
5. En "Commit changes" escribe: "Versión inicial"
6. Haz clic en "Commit changes"

**IMPORTANTE:** Asegúrate de subir TODOS estos archivos y carpetas:
- src/ (carpeta completa con todos los archivos)
- index.html
- package.json
- vite.config.js
- .gitignore
- .env.example
- README.md
- INSTRUCCIONES_DESPLIEGUE.md

## Paso 4: Configurar Supabase (Base de Datos)

1. Ve a https://supabase.com
2. Haz clic en "Start your project"
3. Crea cuenta (puedes usar GitHub para login rápido)
4. Haz clic en "New Project"
5. Completa:
   - Name: `matematicas-primaria`
   - Database Password: (crea una contraseña y GUÁRDALA)
   - Region: `South America (São Paulo)` (más cerca de Perú)
6. Haz clic en "Create new project"
7. Espera 2-3 minutos mientras se crea

### Crear las tablas en Supabase

1. En el menú izquierdo, haz clic en "SQL Editor"
2. Haz clic en "New query"
3. Copia y pega este código:

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

4. Haz clic en "Run" (abajo a la derecha)
5. Deberías ver "Success. No rows returned"

### Obtener las credenciales de Supabase

1. En el menú izquierdo, haz clic en el ícono de engranaje (Settings)
2. Haz clic en "API"
3. Copia y guarda en un bloc de notas:
   - **Project URL** (ejemplo: https://xxxxx.supabase.co)
   - **anon public** key (es una clave larga)

## Paso 5: Desplegar en Vercel

1. Ve a https://vercel.com
2. Haz clic en "Sign Up"
3. Selecciona "Continue with GitHub"
4. Autoriza a Vercel para acceder a GitHub
5. Haz clic en "Add New..." > "Project"
6. Busca tu repositorio `plataforma-matematicas`
7. Haz clic en "Import"

### Configurar variables de entorno en Vercel

1. Antes de hacer clic en "Deploy", ve a "Environment Variables"
2. Agrega estas dos variables:

   **Variable 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: (pega tu Project URL de Supabase)
   
   **Variable 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: (pega tu anon public key de Supabase)

3. Haz clic en "Deploy"
4. Espera 2-3 minutos

¡LISTO! Tu plataforma estará en una URL como: `https://plataforma-matematicas.vercel.app`

## Paso 6: Crear usuarios para los alumnos

1. Vuelve a Supabase
2. En el menú izquierdo, haz clic en "Authentication"
3. Haz clic en "Users"
4. Haz clic en "Add user" > "Create new user"
5. Completa:
   - Email: (email del alumno, puede ser inventado como alumno1@colegio.pe)
   - Password: (crea una contraseña simple que los niños puedan recordar)
   - Auto Confirm User: ACTIVADO (importante)
6. Haz clic en "Create user"
7. Repite para cada alumno

## Paso 7: Subir contenido (clases, ejercicios)

### Opción A: Subir archivos (PDFs, imágenes)

1. En Supabase, ve a "Storage"
2. Haz clic en "Create a new bucket"
3. Name: `materiales`
4. Public bucket: ACTIVADO
5. Haz clic en "Create bucket"
6. Entra al bucket "materiales"
7. Haz clic en "Upload files"
8. Sube tus PDFs, imágenes, etc.
9. Una vez subido, haz clic en el archivo
10. Copia la URL pública

### Opción B: Agregar registros a las tablas

1. Ve a "Table Editor"
2. Selecciona la tabla (ejemplo: `clases_colegio`)
3. Haz clic en "Insert" > "Insert row"
4. Completa los campos:
   - titulo: "Suma de números del 1 al 10"
   - descripcion: "Aprende a sumar números pequeños"
   - grado: "1" (para primer grado)
   - archivo_url: (pega la URL del archivo que subiste)
5. Haz clic en "Save"

## 🎉 ¡Terminado!

Comparte la URL de Vercel con la profesora y los alumnos.
Los alumnos pueden entrar con el email y contraseña que creaste.

## 📱 Probar la plataforma

1. Abre la URL de Vercel en tu navegador
2. Ingresa con uno de los usuarios que creaste
3. Explora las diferentes secciones

## 💡 Actualizar contenido

Para agregar más clases o ejercicios:
1. Ve a Supabase > Table Editor
2. Selecciona la tabla correspondiente
3. Inserta nuevos registros

¡Todo funciona automáticamente sin necesidad de tu ordenador!
