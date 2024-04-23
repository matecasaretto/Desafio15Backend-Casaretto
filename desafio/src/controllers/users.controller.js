import User from "../dao/models/user.model.js";


class UserController {
    static async uploadDocuments(req, res) {
        try {
            const userId = req.params.uid;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

          
            const documents = req.files.map(file => ({
                name: file.originalname,
                path: file.path 
            }));

           
            user.documents = [...user.documents, ...documents];
            await user.save();

            return res.status(200).json({ message: 'Documentos subidos exitosamente', user });
        } catch (error) {
            console.error('Error al subir documentos:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }


    static async changeRol(req, res) {
        try {
            const userId = req.params.uid;
            const user = await User.findById(userId);
    
            if (!user) {
                return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
            }
    
            // Verificar si el usuario tiene los documentos requeridos para el rol "premium"
            const requiredDocuments = ['Identificacion', 'Comprobante_de_domicilio', 'Comprobante_de_estado_de_cuenta'];
            const userDocuments = user.documents.map(doc => doc.name.toLowerCase()); // Convertir nombres a minúsculas
            const requiredDocumentsLower = requiredDocuments.map(doc => doc.toLowerCase()); // Convertir nombres a minúsculas
            const hasAllDocuments = requiredDocumentsLower.every(doc => userDocuments.includes(doc));
    
            if (!hasAllDocuments) {
                return res.status(400).json({ status: "error", message: "El usuario debe cargar todos los documentos requeridos para cambiar a premium." });
            }
    
            // Cambiar el rol del usuario
            user.role = user.role === "user" ? "premium" : "user";
            await user.save();
    
            res.status(200).json({ status: "success", message: "Rol modificado exitosamente" });
        } catch (error) {
            console.error('Error al cambiar el rol del usuario:', error.message);
            res.status(500).json({ status: "error", message: "Hubo un error al cambiar el rol del usuario" });
        }
    }
}

export { UserController };
