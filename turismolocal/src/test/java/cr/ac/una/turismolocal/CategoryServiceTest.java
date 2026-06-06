package cr.ac.una.turismolocal;

import cr.ac.una.turismolocal.entity.Category;
import cr.ac.una.turismolocal.repository.CategoryRepository;
import cr.ac.una.turismolocal.service.impl.CategoryServiceImpl;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class CategoryServiceTest {

    @Test
    void getAllCategoriesShouldReturnOneCategory() {

        CategoryRepository repo = Mockito.mock(CategoryRepository.class);

        Mockito.when(repo.findAll())
                .thenReturn(List.of(new Category()));

        CategoryServiceImpl service = new CategoryServiceImpl(repo);

        assertEquals(1, service.getAllCategories().size());
    }
}