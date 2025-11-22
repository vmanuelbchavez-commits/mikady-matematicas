# SQL para verificar y arreglar políticas

Ejecuta este código en Supabase > SQL Editor para asegurar que las políticas estén correctas:

```sql
-- Eliminar políticas existentes de notas_alumnos si hay conflictos
DROP POLICY IF EXISTS "Usuarios pueden ver sus propias notas" ON notas_alumnos;
DROP POLICY IF EXISTS "Admin puede crear notas" ON notas_alumnos;
DROP POLICY IF EXISTS "Admin puede eliminar notas" ON notas_alumnos;

-- Crear políticas correctas
-- Política 1: Usuarios ven solo sus notas
CREATE POLICY "Usuarios pueden ver sus propias notas" 
ON notas_alumnos FOR SELECT 
USING (auth.uid() = user_id);

-- Política 2: Usuarios autenticados pueden ver todas las notas (para admin)
CREATE POLICY "Admin puede ver todas las notas" 
ON notas_alumnos FOR SELECT 
USING (auth.role() = 'authenticated');

-- Política 3: Usuarios autenticados pueden crear notas
CREATE POLICY "Admin puede crear notas" 
ON notas_alumnos FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Política 4: Usuarios autenticados pueden eliminar notas
CREATE POLICY "Admin puede eliminar notas" 
ON notas_alumnos FOR DELETE 
USING (auth.role() = 'authenticated');

-- Política 5: Usuarios autenticados pueden actualizar notas
CREATE POLICY "Admin puede actualizar notas" 
ON notas_alumnos FOR UPDATE 
USING (auth.role() = 'authenticated');
```

Esto asegura que:
- Los alumnos solo ven sus propias notas
- Miss Mikady (autenticada) puede ver, crear, editar y eliminar todas las notas
