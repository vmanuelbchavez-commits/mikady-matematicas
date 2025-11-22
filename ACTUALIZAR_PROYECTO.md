# 🔄 Cómo Actualizar el Proyecto

## Paso 1: Subir los nuevos archivos a GitHub

1. Ve a tu repositorio en GitHub: https://github.com/tu-usuario/mikady-matematicas
2. Haz clic en **"Add file"** > **"Upload files"**
3. Arrastra TODOS los archivos de tu carpeta local (sobrescribirá los antiguos)
4. En "Commit changes" escribe: `Panel de administración agregado`
5. Haz clic en **"Commit changes"**

## Paso 2: Vercel desplegará automáticamente

- Vercel detectará los cambios automáticamente
- Empezará a construir la nueva versión
- En 2-3 minutos estará lista
- Puedes ver el progreso en: https://vercel.com/dashboard

## Paso 3: Configurar Storage en Supabase

Sigue las instrucciones del archivo `CONFIGURACION_STORAGE.md`:
1. Crear bucket "materiales"
2. Configurar políticas de acceso
3. Crear usuario administrador

## Paso 4: Probar el panel de administración

1. Ve a tu plataforma: https://mikady-matematicas.vercel.app
2. Ingresa con el email de administrador
3. Deberías ver el panel de administración
4. Prueba subir una clase o ejercicio

## ⚠️ Importante

Si el email del administrador NO es `profesora@mikady.com`, debes:

1. En GitHub, ve al archivo `src/App.jsx`
2. Haz clic en el ícono de lápiz (Edit)
3. Busca la línea:
   ```javascript
   const ADMIN_EMAIL = 'profesora@mikady.com'
   ```
4. Cámbiala por el email correcto
5. Haz clic en "Commit changes"
6. Vercel desplegará automáticamente

## ✅ Listo

Ahora la profesora puede gestionar todo desde la plataforma web sin necesidad de entrar a Supabase.
