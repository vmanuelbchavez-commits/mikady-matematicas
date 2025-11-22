# SQL para sistema de clases particulares

Ejecuta este código en Supabase > SQL Editor:

```sql
-- Agregar campo para controlar acceso a clases particulares
ALTER TABLE alumnos_info 
ADD COLUMN acceso_particulares BOOLEAN DEFAULT false;
```

Este campo permite que Miss Mikady controle qué alumnos tienen acceso a las clases particulares.
