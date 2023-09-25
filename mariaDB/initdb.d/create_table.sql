CREATE TABLE IF NOT EXISTS user (
    user_no INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '회원번호',
    user_name VARCHAR(20) NOT NULL UNIQUE COMMENT '서비스내에서 사용하는 유저명(ID로 로그인 한다면 실제 ID값)',
    login_type TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '0: id-pw, 1: social login'
);

CREATE TABLE IF NOT EXISTS social_login (
    social_login_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '고유 식별 값',
    user_no INT UNSIGNED NOT NULL COMMENT '유저 번호',
    social_code TINYINT UNSIGNED NOT NULL COMMENT '1: apple, 2: google, 3: facebook, 4: kakao, 5: naver',
    external_id VARCHAR(64) NOT NULL COMMENT 'oauth_external_id',
    access_token VARCHAR(256) NOT NULL COMMENT 'access token',
    update_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '갱신일자',
    CONSTRAINT login_user_no_FK FOREIGN KEY (user_no) REFERENCES user(user_no) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX (user_no)
);
