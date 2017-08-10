package unitter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import unitter.domain.service.UnitterUserDetailsService;
@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	@Autowired
	UnitterUserDetailsService userDetailsService;

	@Bean
	PasswordEncoder passwordEncoder() {
		//System.out.println("tatuya:" + new BCryptPasswordEncoder().encode("tatuya"));

		return new BCryptPasswordEncoder();
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.authorizeRequests()
		.antMatchers("/js/**", "/css/**", "/accountcreate", "/account/create/**", "/begin/**", "/photo/**", "/fonts/**").permitAll()
		.antMatchers("/**").authenticated()
		.and()
		.formLogin()
		.loginPage("/top")
		.loginProcessingUrl("/login")
		.usernameParameter("username")
		.passwordParameter("password")
		.defaultSuccessUrl("/unitter", true)
		.failureUrl("/loginerror").permitAll();

		http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.ALWAYS);
	}




	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
	}



}
