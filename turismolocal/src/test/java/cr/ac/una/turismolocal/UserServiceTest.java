package cr.ac.una.turismolocal;

import cr.ac.una.turismolocal.entity.User;
import cr.ac.una.turismolocal.repository.UserRepository;
import cr.ac.una.turismolocal.service.impl.UserServiceImpl;
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
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setName("Dana");
        user.setEmail("dana@test.com");
        user.setActive(true);
    }

    @Test
    void shouldReturnAllUsers() {
        when(userRepository.findAll()).thenReturn(List.of(user));

        List<User> result = userService.getAllUsers();

        assertEquals(1, result.size());
    }

    @Test
    void shouldReturnUserById() {
        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        User result = userService.getUserById(1L);

        assertNotNull(result);
    }

    @Test
    void shouldFindUserByEmail() {
        when(userRepository.findByEmail("dana@test.com"))
                .thenReturn(Optional.of(user));

        Optional<User> result =
                userService.getUserByEmail("dana@test.com");

        assertTrue(result.isPresent());
    }

    @Test
    void shouldFindUserByGoogleId() {

        user.setGoogleId("google123");

        when(userRepository.findByGoogleId("google123"))
                .thenReturn(Optional.of(user));

        Optional<User> result =
                userService.getUserByGoogleId("google123");

        assertTrue(result.isPresent());
    }

    @Test
    void shouldSaveUser() {

        User newUser = new User();

        when(userRepository.save(any(User.class)))
                .thenAnswer(i -> i.getArgument(0));

        User result = userService.saveUser(newUser);

        assertTrue(result.getActive());
        assertNotNull(result.getCreatedAt());
        assertNotNull(result.getUpdatedAt());
    }

    @Test
    void shouldUpdateUser() {

        User updated = new User();
        updated.setName("Nuevo");
        updated.setEmail("nuevo@test.com");
        updated.setActive(true);

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(userRepository.save(any(User.class)))
                .thenAnswer(i -> i.getArgument(0));

        User result = userService.updateUser(1L, updated);

        assertEquals("Nuevo", result.getName());
    }

    @Test
    void shouldReturnNullWhenUpdatingMissingUser() {

        when(userRepository.findById(99L))
                .thenReturn(Optional.empty());

        User result = userService.updateUser(99L, user);

        assertNull(result);
    }

    @Test
    void shouldDeleteUser() {

        doNothing().when(userRepository).deleteById(1L);

        userService.deleteUser(1L);

        verify(userRepository).deleteById(1L);
    }
}