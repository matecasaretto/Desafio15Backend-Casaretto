import multer from 'multer';
import { join } from 'path';
import { __dirname } from '../utils.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = '';

        // Determinar la carpeta según el fieldname
        switch (file.fieldname) {
            case 'document':
                folder = 'documents';
                break;
            case 'product':
                folder = 'products';
                break;
            case 'profile':
                folder = 'profiles';
                break;
            default:
                folder = 'default'; // Carpeta predeterminada si no coincide ningún campo
        }

        // Ruta completa de la carpeta de destino
        const destinationFolder = join(__dirname, '..', 'src', 'public', 'files', folder);

        // Llamar al callback con la ruta de destino
        cb(null, destinationFolder);
    },
    filename: function (req, file, cb) {
        // Generar nombre de archivo único con la fecha actual
        const uniqueFileName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueFileName);
    }
});

// Instancia de Multer con la configuración de almacenamiento
const upload = multer({ storage });

export { upload };
