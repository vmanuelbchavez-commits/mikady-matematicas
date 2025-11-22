# Configuración del Storage en Supabase

Para que la profesora pueda subir archivos desde el panel de administración, necesitas configurar el Storage en Supabase:

## Paso 1: Crear el Bucket de Storage

1. Ve a Supabase, proyecto "Mikady"
2. En el menú lateral, haz clic en **"Storage"**
3. Haz clic en **"Create a new bucket"**
4. Completa:
   - Name: `materiales`
   - **Public bucket: ACTIVADO** ✅ (muy importante)
   - File size limit: 50 MB (o más si necesitas)
5. Haz clic en **"Create bucket"**

## Paso 2: Configurar políticas de acceso

1. En Storage, haz clic en el bucket "materiales"
2. Ve a la pestaña **"Policies"**
3. Haz clic en **"New Policy"**

### Política 1: Permitir subir archivos (INSERT)
- Policy name: `Permitir subir archivos`
- Allowed operation: **INSERT**
- Target roles: **authenticated**
- USING expression: `true`
- Haz clic en **"Save policy"**

### Política 2: Permitir ver archivos (SELECT)
- Policy name: `Permitir ver archivos`
- Allowed operation: **SELECT**
- Target roles: **public** (para que todos puedan ver)
- USING expression: `true`
- Haz clic en **"Save policy"**

### Política 3: Permitir eliminar archivos (DELETE)
- Policy name: `Permitir eliminar archivos`
- Allowed operation: **DELETE**
- Target roles: **authenticated**
- USING expression: `true`
- Haz clic en **"Save policy"**

## Paso 3: Crear usuario administrador

1. Ve a **"Authentication"** > **"Users"**
2. Haz clic en **"Add user"** > **"Create new user"**
3. Completa:
   - Email: `profesora@mikady.com` (o el que prefieras)
   - Password: (crea una contraseña segura)
   - **Auto Confirm User: ACTIVADO** ✅
4. Haz clic en **"Create user"**

## ¡Listo!

Ahora la profesora puede:
1. Entrar con su email de administrador
2. Verá el panel de administración automáticamente
3. Podrá subir archivos, crear clases, ejercicios y usuarios
4. Todo desde la interfaz web, sin tocar Supabase

## Nota importante

El email del administrador está configurado en `src/App.jsx` como:
```javascript
const ADMIN_EMAIL = 'profesora@mikady.com'
```

Si usas otro email, debes cambiar esa línea en el código.
