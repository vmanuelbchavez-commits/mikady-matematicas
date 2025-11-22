# SQL para permitir eliminar alumnos

Ejecuta este código en Supabase > SQL Editor:

```sql
-- Política para permitir eliminar alumnos
CREATE POLICY "Admin puede eliminar alumnos" 
ON alumnos_info FOR DELETE 
USING (true);

-- Política para permitir actualizar alumnos (por si acaso)
CREATE POLICY "Admin puede actualizar alumnos" 
ON alumnos_info FOR UPDATE 
USING (true);
```

Esto permitirá que Miss Mikady pueda eliminar alumnos desde el panel de administración.
