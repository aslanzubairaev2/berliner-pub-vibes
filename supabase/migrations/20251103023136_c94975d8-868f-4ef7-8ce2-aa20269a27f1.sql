-- КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ БЕЗОПАСНОСТИ: Ограничение доступа к admin таблицам
-- Проблема: Текущие политики позволяют ЛЮБОМУ аутентифицированному пользователю 
-- читать пароли, session tokens и API keys

-- Удаляем небезопасные политики
DROP POLICY IF EXISTS "Only authenticated admins can access admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can manage their own sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "Authenticated users can manage API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Authenticated users can view API logs" ON public.api_logs;

-- ВАЖНО: Эти таблицы должны быть полностью закрыты от клиентских запросов
-- Доступ только через security definer функции (authenticate_admin, verify_admin_session)

-- Admin Users: НЕТ прямого доступа через клиент
-- (доступ только через security definer функции)
CREATE POLICY "No direct client access to admin_users"
  ON public.admin_users
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- Admin Sessions: НЕТ прямого доступа через клиент
CREATE POLICY "No direct client access to admin_sessions"
  ON public.admin_sessions
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- API Keys: Только service_role может управлять (через функции)
CREATE POLICY "No direct client access to api_keys"
  ON public.api_keys
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- API Logs: Только чтение через service_role, запись через функцию
CREATE POLICY "No direct client access to api_logs"
  ON public.api_logs
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- Комментарии для документации
COMMENT ON POLICY "No direct client access to admin_users" ON public.admin_users IS 
'Критично для безопасности: Доступ к admin_users только через security definer функции (authenticate_admin). Прямой клиентский доступ запрещен для защиты паролей.';

COMMENT ON POLICY "No direct client access to admin_sessions" ON public.admin_sessions IS 
'Критично для безопасности: Доступ к session tokens только через security definer функции (verify_admin_session). Предотвращает кражу токенов.';

COMMENT ON POLICY "No direct client access to api_keys" ON public.api_keys IS 
'Критично для безопасности: API ключи должны управляться только через backend функции с service_role доступом.';

COMMENT ON POLICY "No direct client access to api_logs" ON public.api_logs IS 
'Приватность: Логи API должны быть доступны только через административный интерфейс с proper авторизацией.';