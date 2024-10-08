import { z } from "zod";

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
const pwdRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
const nicknameRegex = /^[a-zA-Z가-힣0-9]{1,5}$/;
const nameRegex = /^[a-zA-Z가-힣\s-]{2,10}$/;
const phoneRegex = /^01([0|1|6|7|8|9])-([0-9]{3,4})-([0-9]{4})$/;

export const signupSchema = z.object({
    userid: z.string().regex(emailRegex),
    userpw: z.string().regex(pwdRegex),
    nickname: z.string().regex(nicknameRegex),
    name: z.string().regex(nameRegex),
    phone: z.string().regex(phoneRegex),
    birth: z.string().date()
})

export const signinSchema = z.object({
    userid: z.string().regex(emailRegex),
    userpw: z.string().regex(pwdRegex)
})

export const dupliEmail = z.object({
    userid: z.string().regex(emailRegex)
})

export const dupliNickname = z.object({
    nickname: z.string().regex(nicknameRegex)
})

export const findidSchema = z.object({
    phone: z.string().regex(phoneRegex)
})

export const findpwSchema = z.object({
    userid: z.string().regex(emailRegex)
})

export const updatePwSchema = z.object({
    userid: z.string().regex(emailRegex),
    userpw: z.string().regex(pwdRegex)
})