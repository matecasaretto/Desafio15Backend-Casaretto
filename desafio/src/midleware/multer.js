import multer from 'multer';
import { join } from 'path';
import { __dirname } from '../utils.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = '';

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
                folder = 'default'; 
        }

      
        const destinationFolder = join(__dirname, '..', 'src', 'public', 'files', folder);

        
        cb(null, destinationFolder);
    },
    filename: function (req, file, cb) {
       
        const uniqueFileName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueFileName);
    }
});


const upload = multer({ storage });

export { upload };
