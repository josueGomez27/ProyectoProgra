package cr.ac.una.turismolocal;

import com.fasterxml.jackson.databind.ObjectMapper;
import cr.ac.una.turismolocal.controller.TownController;
import cr.ac.una.turismolocal.entity.Town;
import cr.ac.una.turismolocal.service.TownService;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        controllers = TownController.class,
        excludeAutoConfiguration = {
                SecurityAutoConfiguration.class,
                OAuth2ClientAutoConfiguration.class,
                OAuth2ClientWebSecurityAutoConfiguration.class
        }
)
class TownControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TownService townService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldGetAllTowns() throws Exception {

        Town town = new Town();
        town.setId(1L);
        town.setName("Liberia");

        when(townService.getAllTowns())
                .thenReturn(List.of(town));

        mockMvc.perform(get("/api/towns"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Liberia"));
    }

    @Test
    void shouldGetTownById() throws Exception {

        Town town = new Town();
        town.setId(1L);
        town.setName("Liberia");

        when(townService.getTownById(1L))
                .thenReturn(town);

        mockMvc.perform(get("/api/towns/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Liberia"));
    }

    @Test
    void shouldSaveTown() throws Exception {

        Town town = new Town();
        town.setId(1L);
        town.setName("Liberia");

        when(townService.saveTown(any(Town.class)))
                .thenReturn(town);

        mockMvc.perform(post("/api/towns")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(town)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Liberia"));
    }

    @Test
    void shouldUpdateTown() throws Exception {

        Town town = new Town();
        town.setId(1L);
        town.setName("Nicoya");

        when(townService.updateTown(anyLong(), any(Town.class)))
                .thenReturn(town);

        mockMvc.perform(put("/api/towns/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(town)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Nicoya"));
    }

    @Test
    void shouldDeleteTown() throws Exception {

        doNothing().when(townService).deleteTown(1L);

        mockMvc.perform(delete("/api/towns/1"))
                .andExpect(status().isOk());
    }
}