import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
import unittest


class TesteBase(unittest.TestCase):
    def setUp(self):
        chrome_options = Options()
        
        if os.getenv('DOCKER_ENV') == 'true':
            chrome_options.add_argument('--headless')
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-dev-shm-usage')
            chrome_options.add_argument('--disable-gpu')
            chrome_options.add_argument('--window-size=1920,1080')
        else:
            chrome_options.add_argument('--start-maximized')
        
        chrome_options.add_argument('--disable-extensions')
        chrome_options.add_argument('--disable-plugins')
        chrome_options.add_argument('--disable-images')
        
        if os.getenv('DOCKER_ENV') == 'true':
            self.base_url = "http://frontend:80"
        else:
            self.base_url = "http://localhost:5173"

        try:
            self.driver = webdriver.Chrome(options=chrome_options)
        except Exception as e:
            print(f"Erro ao inicializar driver: {e}")
            print("Certifique-se de que o Chrome está instalado e o chromedriver está no PATH")
            raise
        
        self.driver.implicitly_wait(2)
        self.wait = WebDriverWait(self.driver, 2)
    
    def tearDown(self):
        if hasattr(self, 'driver'):
            self.driver.quit()
    
    def esperar_elemento(self, by, value, timeout=3):
        return WebDriverWait(self.driver, timeout).until(
            EC.presence_of_element_located((by, value))
        )
    
    def esperar_clicavel(self, by, value, timeout=3):
        return WebDriverWait(self.driver, timeout).until(
            EC.element_to_be_clickable((by, value))
        )
    
    def esperar_texto(self, by, value, text, timeout=3):
        return WebDriverWait(self.driver, timeout).until(
            EC.text_to_be_present_in_element((by, value), text)
        )