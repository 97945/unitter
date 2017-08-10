package unitter.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import unitter.domain.model.User;

public interface UserRepository extends JpaRepository<User, String> {

}
