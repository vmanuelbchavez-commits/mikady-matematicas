# SQL para crear función que elimine usuarios completamente

Ejecuta este código en Supabase > SQL Editor:

```sql
-- Crear una función que elimine el usuario de auth.users
-- Esto solo puede hacerse con una función de base de datos

CREATE OR REPLACE FUNCTION delete_user_completely(user_id_to_delete UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Primero eliminar las notas (por si acaso)
  DELETE FROM notas_alumnos WHERE user_id = user_id_to_delete;
  
  -- Eliminar de alumnos_info
  DELETE FROM alumnos_info WHERE user_id = user_id_to_delete;
  
  -- Finalmente eliminar el usuario de auth
  DELETE FROM auth.users WHERE id = user_id_to_delete;
END;
$$;

-- Dar permisos para que usuarios autenticados puedan usar esta función
GRANT EXECUTE ON FUNCTION delete_user_completely TO authenticated;
```

Esta función permite eliminar usuarios completamente desde la plataforma.
