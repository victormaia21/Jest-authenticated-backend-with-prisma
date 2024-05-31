import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const randomName = `${uuidv4()}${extname(file.originalname)}`;
      callback(null, randomName);
    },
  }),
};
