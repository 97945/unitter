package unitter;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.MessageSourceResolvable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import unitter.domain.resource.ApiError;
import unitter.domain.service.ChangePasswordMisMatchException;
import unitter.domain.service.PasswordCheckException;
import unitter.domain.service.UploadImageException;
import unitter.domain.service.UserExistException;
import unitter.domain.service.UserIdPatternException;

@ControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {
	@SuppressWarnings({ "unchecked", "rawtypes" })
	private final Map<Class<? extends Exception>, String> messageMappings =
			Collections.unmodifiableMap(new LinkedHashMap() {{
				put(HttpMessageNotReadableException.class, "Request body is invalid");
				put(MethodArgumentNotValidException.class, "入力ミスがあります");
				put(BindException.class, "入力ミスがあります");
				put(UserExistException.class, "ユーザー名が重複しています");
				put(PasswordCheckException.class, "パスワードが間違っています");
				put(ChangePasswordMisMatchException.class, "パスワードが一致していません");
				put(UserIdPatternException.class, "ユーザ名は英数字と'_'(アンダーバー)が使えます");
				put(MultipartException.class, "ファイルのサイズが制限を超えています。5MB未満のファイルをアップロードしてください");
				put(UploadImageException.class, "画像を選択してください");
			}});

	private String resolveMessage(Exception ex, String defaultMessage) {
		return messageMappings.entrySet().stream()
				.filter(entry -> entry.getKey().isAssignableFrom(ex.getClass())).findFirst()
				.map(Map.Entry::getValue).orElse(defaultMessage);
	}


	private ApiError createApiError(Exception ex, String defaultMessage) {
		ApiError apiError = new ApiError();
		apiError.setMessage(resolveMessage(ex, defaultMessage));
		return apiError;
	}

	@ExceptionHandler
	public ResponseEntity<Object> handleSystemException(Exception ex, WebRequest request) {
		ApiError apiError = createApiError(ex, "System error is occurred");
		return super.handleExceptionInternal(ex, apiError, null, HttpStatus.INTERNAL_SERVER_ERROR, request);
	}


	@Override
	protected ResponseEntity<Object> handleExceptionInternal(Exception ex, Object body,
															HttpHeaders headers, HttpStatus status, WebRequest request) {
		ApiError apiError = createApiError(ex, "request error");
		return super.handleExceptionInternal(ex, apiError, headers, status, request);

	}






	@ExceptionHandler
	public ResponseEntity<Object> handleUserExsitException(UserExistException ex, WebRequest request) {
		return handleExceptionInternal(ex, null, null, HttpStatus.BAD_REQUEST, request);
	}

	@ExceptionHandler
	public ResponseEntity<Object> handleUserIdPatternException(UserIdPatternException ex, WebRequest request) {
		return handleExceptionInternal(ex, null, null, HttpStatus.BAD_REQUEST, request);
	}

	@ExceptionHandler
	public ResponseEntity<Object> handlePasswordCheckException(PasswordCheckException ex, WebRequest request) {
		return handleExceptionInternal(ex, null, null, HttpStatus.BAD_REQUEST, request);
	}

	@ExceptionHandler
	public ResponseEntity<Object> handleChangePasswordMisMatchException(ChangePasswordMisMatchException ex, WebRequest request) {
		return handleExceptionInternal(ex, null, null, HttpStatus.BAD_REQUEST, request);
	}

	@ExceptionHandler
	public ResponseEntity<Object> handleUploadImageException(UploadImageException ex, WebRequest request) {
		return handleExceptionInternal(ex, null, null, HttpStatus.BAD_REQUEST, request);
	}


	@Autowired
	MessageSource messageSource;

	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers,
																  HttpStatus status, WebRequest request) {
		ApiError apiError = createApiError(ex, ex.getMessage());
		ex.getBindingResult().getGlobalErrors().stream()
		.forEach(e -> apiError.addDetail(e.getObjectName(), getMessage(e, request)));
		ex.getBindingResult().getFieldErrors().stream()
		.forEach(e -> apiError.addDetail(e.getField(), getMessage(e, request)));
		return super.handleExceptionInternal(ex, apiError, headers, status, request);

	}

	private String getMessage(MessageSourceResolvable resolvable, WebRequest request) {
		return messageSource.getMessage(resolvable, request.getLocale());
	}


}