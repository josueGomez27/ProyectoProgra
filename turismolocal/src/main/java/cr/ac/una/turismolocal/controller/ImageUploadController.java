package cr.ac.una.turismolocal.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageUploadController {

    private final Cloudinary cloudinary;
    // Endpoint que recibe una imagen desde el frontend y la sube a Cloudinary
    @PostMapping("/upload")
    public Map<String, String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Se sube el archivo a Cloudinary dentro de la carpeta del proyecto
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "turismo-local"
                    )
            );
            // Cloudinary devuelve una URL segura de la imagen subida
            String imageUrl = uploadResult.get("secure_url").toString();
            // Se devuelve la URL al frontend para guardarla en el formulario
            return Map.of("imageUrl", imageUrl);

        } catch (Exception e) {
            throw new RuntimeException("Error al subir la imagen", e);
        }
    }
}