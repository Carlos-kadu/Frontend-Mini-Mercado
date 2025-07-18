import unittest
from selenium.webdriver.common.by import By
from test_base import TesteBase
import time
import pytest


class TesteNavegacao(TesteBase):
    @pytest.fixture(autouse=True)
    def setup_and_teardown(self):
        self.setUp()
        yield
        self.tearDown()

    def testar_pagina_inicial(self):
        self.driver.get(self.base_url)
        
        titulo = self.esperar_elemento(By.TAG_NAME, "h1")
        assert "Dashboard" in titulo.text
        
        mascote = self.esperar_elemento(By.TAG_NAME, "img")
        assert mascote.is_displayed()
        
        cards = self.driver.find_elements(By.CLASS_NAME, "dashboard-card")
        assert len(cards) > 0
    
    def testar_navegacao_navbar(self):
        self.driver.get(self.base_url)
        
        produtos_link = self.esperar_clicavel(By.XPATH, "//a[contains(text(), 'Produtos')]")
        produtos_link.click()
        
        self.esperar_elemento(By.XPATH, "//h2[contains(text(), 'Produtos')]")
        assert "produtos" in self.driver.current_url
        
        self.driver.get(self.base_url)
        empresas_link = self.esperar_clicavel(By.XPATH, "//a[contains(text(), 'Empresas')]")
        empresas_link.click()
        
        self.esperar_elemento(By.XPATH, "//h2[contains(text(), 'Empresas')]")
        assert "empresas" in self.driver.current_url
        
        self.driver.get(self.base_url)
        filiais_link = self.esperar_clicavel(By.XPATH, "//a[contains(text(), 'Filiais')]")
        filiais_link.click()

        self.esperar_elemento(By.XPATH, "//h2[contains(text(), 'Gestão de Filiais')]")
        assert "filiais" in self.driver.current_url
    
    def testar_responsividade(self):
        self.driver.get(self.base_url)
        
        tamanhos_tela = [(1920, 1080), (1366, 768), (768, 1024), (375, 667)]
        
        for largura, altura in tamanhos_tela:
            self.driver.set_window_size(largura, altura)
            time.sleep(1)
            
            navbar = self.driver.find_element(By.TAG_NAME, "nav")
            assert navbar.is_displayed()
            
            largura_body = self.driver.execute_script("return document.body.scrollWidth")
            largura_viewport = self.driver.execute_script("return window.innerWidth")
            assert largura_body <= largura_viewport


if __name__ == "__main__":
    unittest.main() 