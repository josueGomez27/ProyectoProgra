package cr.ac.una.turismolocal;

import cr.ac.una.turismolocal.entity.Category;
import cr.ac.una.turismolocal.repository.CategoryRepository;
import cr.ac.una.turismolocal.service.impl.CategoryServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    private Category category;

    @BeforeEach
    void setUp() {
        category = new Category();
        category.setId(1L);
        category.setName("Turismo");
        category.setColor("#FF0000");
        category.setActive(true);
    }

    @Test
    void shouldReturnAllCategories() {
        when(categoryRepository.findAll())
                .thenReturn(List.of(category));

        List<Category> result = categoryService.getAllCategories();

        assertEquals(1, result.size());
        verify(categoryRepository).findAll();
    }

    @Test
    void shouldReturnCategoryById() {
        when(categoryRepository.findById(1L))
                .thenReturn(Optional.of(category));

        Category result = categoryService.getCategoryById(1L);

        assertNotNull(result);
        assertEquals("Turismo", result.getName());
    }

    @Test
    void shouldReturnNullWhenCategoryNotFound() {
        when(categoryRepository.findById(99L))
                .thenReturn(Optional.empty());

        Category result = categoryService.getCategoryById(99L);

        assertNull(result);
    }

    @Test
    void shouldSaveCategory() {
        when(categoryRepository.save(any(Category.class)))
                .thenReturn(category);

        Category result = categoryService.saveCategory(category);

        assertNotNull(result);
        verify(categoryRepository).save(any(Category.class));
    }

    @Test
    void shouldUpdateCategory() {

        Category updated = new Category();
        updated.setName("Aventura");
        updated.setColor("#00FF00");
        updated.setActive(true);

        when(categoryRepository.findById(1L))
                .thenReturn(Optional.of(category));

        when(categoryRepository.save(any(Category.class)))
                .thenAnswer(i -> i.getArgument(0));

        Category result = categoryService.updateCategory(1L, updated);

        assertEquals("Aventura", result.getName());
    }

    @Test
    void shouldReturnNullWhenUpdatingNonExistingCategory() {

        when(categoryRepository.findById(99L))
                .thenReturn(Optional.empty());

        Category result = categoryService.updateCategory(99L, category);

        assertNull(result);
    }

    @Test
    void shouldDeleteCategory() {

        doNothing().when(categoryRepository).deleteById(1L);

        categoryService.deleteCategory(1L);

        verify(categoryRepository).deleteById(1L);
    }
}