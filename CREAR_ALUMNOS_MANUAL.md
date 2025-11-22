# 👥 Cómo Crear Alumnos Manualmente en Supabase

Por limitaciones de seguridad, los alumnos deben crearse directamente en Supabase. Es muy fácil:

## Pasos para crear un alumno:

1. **Ve a Supabase** (https://supabase.com)
2. Entra a tu proyecto **"Mikady"**
3. En el menú lateral, haz clic en **"Authentication"**
4. Haz clic en **"Users"**
5. Haz clic en **"Add user"** > **"Create new user"**
6. Completa:
   - **Email**: `alumno1@colegio.pe` (o el que prefieras)
   - **Password**: `matematicas123` (o una contraseña simple)
   - **Auto Confirm User**: ✅ **ACTIVADO** (muy importante)
7. Haz clic en **"Create user"**

## Agregar el nombre del alumno:

Después de crear el usuario, necesitas agregar su nombre a la tabla:

1. Ve a **"Table Editor"** en Supabase
2. Selecciona la tabla **"alumnos_info"**
3. Haz clic en **"Insert"** > **"Insert row"**
4. Completa:
   - **user_id**: Copia el ID del usuario que acabas de crear (está en Authentication > Users)
   - **nombre**: "Juan Pérez" (nombre completo del alumno)
   - **email**: El mismo email que usaste arriba
5. Haz clic en **"Save"**

## Ejemplo completo:

**Alumno 1:**
- Email: `maria.lopez@colegio.pe`
- Password: `maria123`
- Nombre: María López

**Alumno 2:**
- Email: `carlos.gomez@colegio.pe`
- Password: `carlos123`
- Nombre: Carlos Gómez

## Notas importantes:

- ✅ Siempre activa "Auto Confirm User"
- ✅ Usa contraseñas simples que los niños puedan recordar
- ✅ Los emails pueden ser inventados (no necesitan ser reales)
- ✅ Anota el email y contraseña para dárselo al alumno
- ✅ Después de crear el usuario, agrega su nombre en la tabla "alumnos_info"

## Una vez creados:

Los alumnos pueden entrar a la plataforma con su email y contraseña.
Miss Mikady podrá ver la lista de alumnos en el panel de administración y agregar notas para cada uno.
