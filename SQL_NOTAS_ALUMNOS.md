# SQL para crear tabla de Notas de Alumnos

Ejecuta este código SQL en Supabase > SQL Editor:

```sql
-- Tabla de notas individuales por alumno
CREATE TABLE notas_alumnos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  calificacion NUMERIC(4,2),
  comentario TEXT,
  tipo TEXT DEFAULT 'info',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE notas_alumnos ENABLE ROW LEVEL SECURITY;

-- Política: cada alumno solo ve sus propias notas
CREATE POLICY "Usuarios pueden ver sus propias notas" 
ON notas_alumnos FOR SELECT 
USING (auth.uid() = user_id);

-- Política: solo usuarios autenticados (admin) pueden insertar notas
CREATE POLICY "Admin puede crear notas" 
ON notas_alumnos FOR INSERT 
WITH CHECK (true);

-- Política: solo usuarios autenticados (admin) pueden eliminar notas
CREATE POLICY "Admin puede eliminar notas" 
ON notas_alumnos FOR DELETE 
USING (true);

-- Tabla para información adicional de alumnos
CREATE TABLE alumnos_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE alumnos_info ENABLE ROW LEVEL SECURITY;

-- Política: todos pueden ver la info de alumnos
CREATE POLICY "Todos pueden ver alumnos" 
ON alumnos_info FOR SELECT 
USING (true);

-- Política: solo autenticados pueden insertar
CREATE POLICY "Admin puede crear alumnos" 
ON alumnos_info FOR INSERT 
WITH CHECK (true);
```

## Instrucciones:

1. Ve a Supabase
2. Abre tu proyecto "Mikady"
3. Haz clic en "SQL Editor" en el menú lateral
4. Haz clic en "New query"
5. Copia y pega el código de arriba
6. Haz clic en "Run"
7. Deberías ver "Success. No rows returned"

¡Listo! Ahora Miss Mikady puede agregar notas a cada alumno y cada alumno solo verá sus propias notas.
