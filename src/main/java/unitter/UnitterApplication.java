package unitter;

import org.apache.catalina.connector.Connector;
import org.apache.coyote.http11.AbstractHttp11Protocol;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.embedded.tomcat.TomcatEmbeddedServletContainerFactory;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class UnitterApplication {

	public static void main(String[] args) {
		SpringApplication.run(UnitterApplication.class, args);
	}

	@Bean
	public TomcatEmbeddedServletContainerFactory containerFactory() {
		return new TomcatEmbeddedServletContainerFactory() {
			@Override
			protected void customizeConnector(Connector connector) {
				super.customizeConnector(connector);
				if((connector.getProtocolHandler() instanceof AbstractHttp11Protocol<?>)) {
					((AbstractHttp11Protocol<?>) connector.getProtocolHandler()).setMaxSwallowSize(-1);
				}
			}
		};
	}
}
