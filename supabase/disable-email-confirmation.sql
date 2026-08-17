-- ============================================
-- Happi Nuts - Disable Email Confirmation
-- Run this in the Supabase SQL Editor
-- ============================================
--
-- This disables the "Confirm email" requirement so users
-- can sign up and use their account immediately without
-- having to click a verification link in their email.
--
-- After running this, new signups will get a session
-- immediately and can log in right away.

-- Disable email confirmation (mailer_autoconfirm = true means
-- users are auto-confirmed and no verification email is required)
update auth.config
set mailer_autoconfirm = true;

-- Confirm any existing users who signed up but never confirmed
-- their email, so they can log in immediately too.
update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now())
where email_confirmed_at is null;

-- Verify the setting took effect
select
  instance_id,
  mailer_autoconfirm
from auth.config;