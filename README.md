# UPHiLL 프로젝트
## 목차
1. [개요](#개요)
2. [주요 기능](#주요기능)
3. [팀 내 역할](#팀-내-역할)
4. [이슈사항](#이슈사항)

## 개요
 기간 : 2024.09.24 ~ 2024.10.28 <br>

 개발 인원 : 5명 
 - 팀원 1 (BE) : 김기현
 - 팀원 2 (BE) : 이민혁
 - 팀원 3 (FE) : 김민지
 - 팀원 4 (FE) : 박상철
 - 팀원 5 (FE) : 이경재

기술 스택   
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white"> <img src="https://img.shields.io/badge/HTML-D0654C?style=for-the-badge&logo=HTML5&logoColor=white"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black"> <img src="https://img.shields.io/badge/Typescript-3D6AAC?style=for-the-badge&logo=Typescript&logoColor=white"> <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"> 
<img src="https://img.shields.io/badge/-NestJs-ea2845?style=for-the-badge&logo=nestjs&logoColor=white"> <img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&labelColor=52B0E7&logoColor=FFF"> <img src="https://shields.io/badge/MySQL-blue?logo=mysql&style=for-the-badge&logoColor=white&labelColor=blue"> 


목표
 - GPS를 활용한 등산관련 태크 앱 구현
 - 등산 고도에 따른 포인트 지급
 - 포인트로 상품을 구매 기능 구현 

front git 
> https://github.com/phone001/UPHiLLProjectFront.git

URL
> https://uphillmount.store

## 주요기능
- 로그인 / 회원가입   
  ► 사용자 정보를 입력받아 저장하고 인증받아 다음 페이지로 이동
  ![Screenshot_20241028-170607_UPHiLL](https://github.com/user-attachments/assets/761cea0e-b4ba-49cf-91e1-52e58ef08348)
![Screenshot_20241028-170611_UPHiLL](https://github.com/user-attachments/assets/e6ca54b6-274b-4be8-96e0-81bab3c267c2)



- 지도   
  ►현재 사용자의 위치 정보를 표시하고 높아지는 고도에 따라 포인트를 지급
  ![Screenshot_20241028-170656_UPHiLL](https://github.com/user-attachments/assets/f07109bc-a793-45ca-af36-d55326d2b403)


- 아바타 및 상품   
  ► 지급된 포인트로 아바타나 상품을 구매
  ![Screenshot_20241028-170701_UPHiLL](https://github.com/user-attachments/assets/ce8fefc7-4910-4b28-8605-625bbfc5f401)
![Screenshot_20241028-170706_UPHiLL](https://github.com/user-attachments/assets/06252a03-c2f8-4594-8ee1-16a38480e79a)


- 보관함
  ► 유저가 구매한 상품을 확인하고 사용
  ![Screenshot_20241028-170714_UPHiLL](https://github.com/user-attachments/assets/fb8383de-aeb3-4795-ba61-f8d436101226)
![Screenshot_20241028-170726_UPHiLL](https://github.com/user-attachments/assets/740bc37f-9a78-408a-b647-6f2fb6e28596)

- 개인정보   
  ► 현재 유저의 정보를 확인하고 닉네임 및 패스워드 변경
  ![Screenshot_20241028-170729_UPHiLL](https://github.com/user-attachments/assets/eaa00357-267e-4a50-a730-8b7d2dfdf5c1)

- 구매정보   
  ► 현재 유저가 구매한 상품이력을 확인
  ![Screenshot_20241028-170733_UPHiLL](https://github.com/user-attachments/assets/0af3d666-560f-4f16-9318-35011f7e2606)

- 시연영상   
  
https://github.com/user-attachments/assets/39ad9a06-8995-4e51-bf9e-d7e76730c75e

## 팀 내 역할 
1) 상품 및 아바타
   - 상품을 등록, 수정, 삭제, 사용 등 전반적인 로직 구현

2) 지도 API
   - 지도 API 테스트 및 적용
  
## 이슈사항
| 문제점 | 해결방안 |
|:---:|:---:|
  모바일 환경에서 지도에 실시간 위치 조회 안됨  | React Native에서 위치정보를 메시지 형식으로 전송하여 사용 |
  고도 정보 조회 | google의 elevation API를 사용하여 위도, 경도에 해당하는 위치의 고도를 조회  |
  무한 스크롤 구현시 두번째 페이지 조회 안됨 |  상태값을 감시하여 변화될 때 리렌더링 |
