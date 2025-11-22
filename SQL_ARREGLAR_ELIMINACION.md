# SQL para permitir eliminar usuarios completamente

Ejecuta este código en Supabase > SQL Editor:

```sql
-- Primero, eliminar las restricciones existentes
ALTER TABLE alumnos_info DROP CONSTRAINT IF EXISTS alumnos_info_user_id_fkey;
ALTER TABLE notas_alumnos DROP CONSTRAINT IF EXISTS notas_alumnos_user_id_fkey;

-- Recrear las restricciones con ON DELETE CASCADE
-- Esto significa que cuando se elimine un usuario de auth.users,
-- automáticamente se eliminarán sus registros en estas tablas

ALTER TABLE alumnos_info 
ADD CONSTRAINT alumnos_info_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

ALTER TABLE notas_alumnos 
ADD CONSTRAINT notas_alumnos_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;
```

Después de ejecutar esto, cuando elimines un usuario desde Supabase > Authentication > Users, automáticamente se eliminarán:
- Sus datos de `alumnos_info`
- Todas sus notas de `notas_alumnos`
