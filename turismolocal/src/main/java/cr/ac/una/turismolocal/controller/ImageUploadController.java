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

    @PostMapping("/upload")
    public Map<String, String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "turismo-local"
                    )
            );

            String imageUrl = uploadResult.get("secure_url").toString();

            return Map.of("imageUrl", imageUrl);

        } catch (Exception e) {
            throw new RuntimeException("Error al subir la imagen", e);
        }
    }
}