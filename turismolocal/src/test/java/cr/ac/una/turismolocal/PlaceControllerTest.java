package cr.ac.una.turismolocal;

import com.fasterxml.jackson.databind.ObjectMapper;
import cr.ac.una.turismolocal.controller.PlaceController;
import cr.ac.una.turismolocal.entity.*;
import cr.ac.una.turismolocal.repository.CategoryRepository;
import cr.ac.una.turismolocal.repository.TownRepository;
import cr.ac.una.turismolocal.service.PlaceService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.client.OAuth2ClientAutoConfiguration;
import org.springframework.boot.autoconfigure.security.oauth2.client.servlet.OAuth2ClientWebSecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        controllers = PlaceController.class,
        excludeAutoConfiguration = {
                SecurityAutoConfiguration.class,
                OAuth2ClientAutoConfiguration.class,
                OAuth2ClientWebSecurityAutoConfiguration.class
        }
)
class PlaceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private PlaceService placeService;

    @MockitoBean
    private TownRepository townRepository;

    @MockitoBean
    private CategoryRepository categoryRepository;

    @Test
    void shouldGetAllPlaces() throws Exception {

        Place place = new Place();
        place.setId(1L);
        place.setName("Parque");

        when(placeService.getAllPlaces())
                .thenReturn(List.of(place));

        mockMvc.perform(get("/api/places"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Parque"));
    }

    @Test
    void shouldGetPlaceById() throws Exception {

        Place place = new Place();
        place.setId(1L);
        place.setName("Parque");

        when(placeService.getPlaceById(1L))
                .thenReturn(place);

        mockMvc.perform(get("/api/places/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Parque"));
    }

    @Test
    void shouldGetPlacesByTown() throws Exception {

        Place place = new Place();
        place.setId(1L);
        place.setName("Parque");

        when(placeService.getPlacesByTown(1L))
                .thenReturn(List.of(place));

        mockMvc.perform(get("/api/places/town/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Parque"));
    }

    @Test
    void shouldSavePlace() throws Exception {

        Town town = new Town();
        town.setId(1L);

        Category category = new Category();
        category.setId(1L);

        when(townRepository.findById(1L))
                .thenReturn(Optional.of(town));

        when(categoryRepository.findById(1L))
                .thenReturn(Optional.of(category));

        Place place = new Place();
        place.setId(1L);
        place.setName("Parque");

        when(placeService.savePlace(any(Place.class)))
                .thenReturn(place);

        String body = """
        {
          "name":"Parque",
          "townId":1,
          "categoryId":1
        }
        """;

        mockMvc.perform(post("/api/places")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Parque"));
    }

    @Test
    void shouldUpdatePlace() throws Exception {

        Place existing = new Place();
        existing.setId(1L);
        existing.setName("Viejo");

        when(placeService.getPlaceById(1L))
                .thenReturn(existing);

        when(placeService.updatePlace(eq(1L), any(Place.class)))
                .thenAnswer(i -> i.getArgument(1));

        String body = """
        {
          "name":"Nuevo"
        }
        """;

        mockMvc.perform(put("/api/places/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Nuevo"));
    }

    @Test
    void shouldDeletePlace() throws Exception {

        doNothing().when(placeService).deletePlace(1L);

        mockMvc.perform(delete("/api/places/1"))
                .andExpect(status().isOk());
    }
}