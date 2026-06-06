package cr.ac.una.turismolocal.service;

import cr.ac.una.turismolocal.entity.User;
import java.util.List;
import java.util.Optional;

public interface UserService {

    List<User> getAllUsers();

    User getUserById(Long id);

    Optional<User> getUserByEmail(String email);

    Optional<User> getUserByGoogleId(String googleId);

    User saveUser(User user);

    User updateUser(Long id, User user);

    void deleteUser(Long id);
}