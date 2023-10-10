CREATE TABLE IF NOT EXISTS user (
    user_no INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '회원번호',
    user_name VARCHAR(50) NOT NULL UNIQUE COMMENT '서비스내에서 사용하는 유저명(ID로 로그인 한다면 실제 ID값)',
    login_type TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '0: id-pw, 1: social login'
);

CREATE TABLE IF NOT EXISTS social_login (
    social_login_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '고유 식별 값',
    user_no INT UNSIGNED NOT NULL COMMENT '유저 번호',
    social_code TINYINT UNSIGNED NOT NULL COMMENT '1: apple, 2: google, 3: facebook, 4: kakao, 5: naver',
    external_id VARCHAR(64) NOT NULL COMMENT 'oauth_external_id',
    access_token VARCHAR(256) NOT NULL COMMENT 'access token',
    update_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '갱신일자',
    FOREIGN KEY (user_no) REFERENCES user(user_no) on update cascade on delete cascade
);

CREATE TABLE IF NOT EXISTS password (
    password_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '고유 식별 값',
    user_no INT UNSIGNED NOT NULL COMMENT '유저 번호',
    salt VARCHAR(128) NOT NULL COMMENT 'hash 값',
    password VARCHAR(128) NOT NULL COMMENT 'SHA-512 단방향 암호화',
    update_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '갱신일자',
    FOREIGN KEY (user_no) REFERENCES user(user_no) on update cascade on delete cascade
);

CREATE TABLE IF NOT EXISTS user_profile (
    user_profile_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '유저 프로필 식별 값',
    user_no INT UNSIGNED NOT NULL COMMENT '유저 번호',
    jti VARCHAR(256) DEFAULT NULL COMMENT 'Unique JWT ID',
    first_name VARCHAR(256) DEFAULT NULL COMMENT '이름',
    last_name VARCHAR(256) DEFAULT NULL COMMENT '성',
    gender CHAR(1) DEFAULT NULL COMMENT '성별',
    is_agreement_service CHAR(1) default 'N' comment '서비스 이용약관 동의여부: Y: 동의, N: 동의안함',
	is_agreement_policy CHAR(1) default 'N' comment '개인정보 취급방침 동의여부: Y: 동의, N: 동의안함',
    update_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '갱신일자',
    FOREIGN KEY (user_no) REFERENCES user(user_no) on update cascade on delete cascade
);