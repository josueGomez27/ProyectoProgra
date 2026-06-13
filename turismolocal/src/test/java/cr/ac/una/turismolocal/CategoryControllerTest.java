package cr.ac.una.turismolocal;

import com.fasterxml.jackson.databind.ObjectMapper;
import cr.ac.una.turismolocal.controller.CategoryController;
import cr.ac.una.turismolocal.entity.Category;
import cr.ac.una.turismolocal.service.CategoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.client.OAuth2ClientAutoConfiguration;
import org.springframework.boot.autoconfigure.security.oauth2.client.servlet.OAuth2ClientWebSecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        controllers = CategoryController.class,
        excludeAutoConfiguration = {
                SecurityAutoConfiguration.class,
                OAuth2ClientAutoConfiguration.class,
                OAuth2ClientWebSecurityAutoConfiguration.class
        }
)
class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CategoryService categoryService;

    @Test
    void shouldGetAllCategories() throws Exception {

        Category category = new Category();
        category.setId(1L);
        category.setName("Turismo");

        when(categoryService.getAllCategories())
                .thenReturn(List.of(category));

        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Turismo"));
    }

    @Test
    void shouldGetCategoryById() throws Exception {

        Category category = new Category();
        category.setId(1L);
        category.setName("Turismo");

        when(categoryService.getCategoryById(1L))
                .thenReturn(category);

        mockMvc.perform(get("/api/categories/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Turismo"));
    }

    @Test
    void shouldSaveCategory() throws Exception {

        Category category = new Category();
        category.setId(1L);
        category.setName("Turismo");

        when(categoryService.saveCategory(any(Category.class)))
                .thenReturn(category);

        mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(category)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Turismo"));
    }

    @Test
    void shouldUpdateCategory() throws Exception {

        Category category = new Category();
        category.setId(1L);
        category.setName("Aventura");

        when(categoryService.updateCategory(anyLong(), any(Category.class)))
                .thenReturn(category);

        mockMvc.perform(put("/api/categories/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(category)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Aventura"));
    }

    @Test
    void shouldDeleteCategory() throws Exception {

        doNothing().when(categoryService).deleteCategory(1L);

        mockMvc.perform(delete("/api/categories/1"))
                .andExpect(status().isOk());
    }
}