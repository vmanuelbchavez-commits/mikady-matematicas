# SQL para actualizar tabla de alumnos con más campos

Ejecuta este código en Supabase > SQL Editor:

```sql
-- Agregar nuevos campos a la tabla alumnos_info
ALTER TABLE alumnos_info 
ADD COLUMN edad INTEGER,
ADD COLUMN grado TEXT,
ADD COLUMN nombre_padre TEXT,
ADD COLUMN observaciones TEXT,
ADD COLUMN datos_completos BOOLEAN DEFAULT false;
```

Este SQL agrega los campos necesarios para almacenar toda la información del alumno.
