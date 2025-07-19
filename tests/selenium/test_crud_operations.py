import unittest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from test_base import TesteBase
import pytest


class TesteCRUDOperations(TesteBase):
    @pytest.fixture(autouse=True)
    def setup_and_teardown(self):
        self.setUp()
        self.cleanup_test_data()
        self.close_any_open_modals()
        yield
        self.cleanup_test_data()
        self.close_any_open_modals()
        self.tearDown()
    
    def cleanup_test_data(self):
        try:
            self.cleanup_products()
            self.cleanup_filiais()
            self.cleanup_empresas()
        except Exception as e:
            pass
    
    def cleanup_products(self):
        test_names = [
            "Produto Teste Selenium",
            "Produto Teste Editado", 
            "Produto Teste Playwright",
            "Produto Teste",
            "Teste Produto"
        ]
        
        for categoria in ['alimentacao', 'vestuario', 'utilidades-domesticas']:
            try:
                self.driver.get(f"{self.base_url}/produtos/{categoria}")
                time.sleep(1)
                
                for name in test_names:
                    try:
                        delete_btn = self.driver.find_element(By.XPATH, f"//td[contains(text(), '{name}')]/..//button[@title='Excluir']")
                        delete_btn.click()
                        
                        confirm_btn = self.esperar_clicavel(By.XPATH, "//button[contains(text(), 'Confirmar')]", timeout=3)
                        confirm_btn.click()
                        time.sleep(1)
                    except:
                        pass
            except Exception as e:
                pass
    
    def cleanup_filiais(self):
        test_names = [
            "Cidade Teste Selenium",
            "Cidade Teste Editada",
            "Cidade Teste Playwright",
            "Cidade Teste",
            "Teste Cidade"
        ]
        
        try:
            self.driver.get(f"{self.base_url}/filiais")
            time.sleep(1)
            
            for name in test_names:
                try:
                    delete_btn = self.driver.find_element(By.XPATH, f"//td[contains(text(), '{name}')]/..//i[@class='fa-solid fa-trash']")
                    delete_btn.click()
                    
                    confirm_btn = self.esperar_clicavel(By.XPATH, "//button[contains(text(), 'Confirmar')]", timeout=3)
                    confirm_btn.click()
                    time.sleep(1)
                except:
                    pass
        except Exception as e:
            pass
    
    def cleanup_empresas(self):
        test_names = [
            "Empresa Teste Selenium",
            "Empresa Teste Editada",
            "Empresa Teste Playwright",
            "Empresa Teste",
            "Teste Empresa"
        ]
        
        try:
            self.driver.get(f"{self.base_url}/empresas")
            time.sleep(1)
            
            for name in test_names:
                try:
                    delete_btn = self.driver.find_element(By.XPATH, f"//td[contains(text(), '{name}')]/..//i[@class='fa-solid fa-trash']")
                    delete_btn.click()
                    
                    confirm_btn = self.esperar_clicavel(By.XPATH, "//button[contains(text(), 'Confirmar')]", timeout=3)
                    confirm_btn.click()
                    time.sleep(1)
                except:
                    pass
        except Exception as e:
            pass

    def close_any_open_modals(self):
        try:
            cancel_btn = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Cancelar')]")
            if cancel_btn.is_displayed():
                cancel_btn.click()
                time.sleep(1)
        except:
            pass
        
        try:
            close_btn = self.driver.find_element(By.CSS_SELECTOR, ".modal-header .btn-close")
            if close_btn.is_displayed():
                close_btn.click()
                time.sleep(1)
        except:
            pass

    def testar_empresa_crud(self):
        self.driver.get(f"{self.base_url}/empresas")
        time.sleep(1)
        
        self.close_any_open_modals()
        
        try:
            nova_empresa_btn = self.esperar_clicavel(By.XPATH, "//a[contains(text(), 'Nova Empresa')]", timeout=3)
            nova_empresa_btn.click()
        except Exception as e:
            raise
        
        try:
            razao_social_input = self.esperar_elemento(By.NAME, "razao_social", timeout=3)
            razao_social_input.clear()
            razao_social_input.send_keys("Empresa Teste Selenium")
            
            cnpj_input = self.driver.find_element(By.NAME, "cnpj")
            cnpj_input.clear()
            cnpj_input.send_keys("12345678000199")
            
            max_filiais_input = self.driver.find_element(By.NAME, "num_max_filiais")
            max_filiais_input.clear()
            max_filiais_input.send_keys("5")
        except Exception as e:
            raise
        
        try:
            salvar_btn = self.esperar_clicavel(By.XPATH, "//button[contains(text(), 'Salvar')]", timeout=3)
            salvar_btn.click()
        except Exception as e:
            raise
        
        try:
            self.esperar_elemento(By.XPATH, "//h2[contains(text(), 'Empresas')]", timeout=3)
        except Exception as e:
            raise
        
        try:
            self.esperar_texto(By.TAG_NAME, "body", "Empresa Teste Selenium", timeout=3)
        except Exception as e:
            raise
        
        try:
            empresa_row = self.driver.find_element(By.XPATH, f"//td[contains(text(), 'Empresa Teste Selenium')]/..")
            empresa_id = empresa_row.get_attribute("id").replace("empresa-row-", "")
            
            edit_btn = self.esperar_clicavel(By.ID, f"edit-empresa-{empresa_id}", timeout=3)
            edit_btn.click()
        except Exception as e:
            raise
        
        try:
            razao_social_input = self.esperar_elemento(By.NAME, "razao_social", timeout=3)
            razao_social_input.clear()
            razao_social_input.send_keys("Empresa Teste Editada")
            
            cnpj_input = self.driver.find_element(By.NAME, "cnpj")
            cnpj_input.clear()
            cnpj_input.send_keys("98765432000199")
            
            max_filiais_input = self.driver.find_element(By.NAME, "num_max_filiais")
            max_filiais_input.clear()
            max_filiais_input.send_keys("10")
        except Exception as e:
            raise
        
        try:
            salvar_btn = self.esperar_clicavel(By.XPATH, "//button[contains(text(), 'Salvar')]", timeout=3)
            salvar_btn.click()
        except Exception as e:
            raise
        
        try:
            self.esperar_elemento(By.XPATH, "//h2[contains(text(), 'Empresas')]", timeout=3)
        except Exception as e:
            raise
        
        try:
            self.esperar_texto(By.TAG_NAME, "body", "Empresa Teste Editada", timeout=3)
        except Exception as e:
            raise
        
        try:
            empresa_row = self.driver.find_element(By.XPATH, f"//td[contains(text(), 'Empresa Teste Editada')]/..")
            empresa_id = empresa_row.get_attribute("id").replace("empresa-row-", "")
            
            delete_btn = self.esperar_clicavel(By.ID, f"delete-empresa-{empresa_id}", timeout=3)
            delete_btn.click()
        except Exception as e:
            raise
        
        try:
            self.esperar_elemento(By.CLASS_NAME, "modal-content", timeout=3)
            
            confirm_selectors = [
                "//button[contains(text(), 'Confirmar')]",
                "//button[text()='Confirmar']",
                "//div[@class='modal-footer']//button[contains(text(), 'Confirmar')]",
                "//div[@class='modal-footer']//button[text()='Confirmar']"
            ]
            
            confirm_btn = None
            for selector in confirm_selectors:
                try:
                    confirm_btn = self.esperar_clicavel(By.XPATH, selector, timeout=5)
                    break
                except:
                    continue
            
            if not confirm_btn:
                raise Exception("Não conseguiu encontrar botão Confirmar")
                
            confirm_btn.click()
            time.sleep(1)
        except Exception as e:
            raise
        
        try:
            body_text = self.driver.find_element(By.TAG_NAME, "body").text
            assert "Empresa Teste Editada" not in body_text
        except Exception as e:
            raise

    def garantir_empresa_existe(self, nome="Empresa Teste Selenium", cnpj="12345678000199"):
        self.driver.get(f"{self.base_url}/empresas")
        
        try:
            empresas_rows = self.driver.find_elements(By.CSS_SELECTOR, "tbody tr")
            if len(empresas_rows) > 0:
                return
        except:
            pass
        
        try:
            nova_empresa_btn = self.esperar_clicavel(By.XPATH, "//a[contains(text(), 'Nova Empresa')]", timeout=3)
            nova_empresa_btn.click()
            
            razao_social_input = self.esperar_elemento(By.NAME, "razao_social", timeout=3)
            razao_social_input.clear()
            razao_social_input.send_keys(nome)
            
            cnpj_input = self.driver.find_element(By.NAME, "cnpj")
            cnpj_input.clear()
            cnpj_input.send_keys(cnpj)
            
            max_filiais_input = self.driver.find_element(By.NAME, "num_max_filiais")
            max_filiais_input.clear()
            max_filiais_input.send_keys("5")
            
            salvar_btn = self.esperar_clicavel(By.XPATH, "//button[contains(text(), 'Salvar')]", timeout=3)
            salvar_btn.click()
            
            self.esperar_texto(By.TAG_NAME, "body", nome, timeout=3)
        except Exception as e:
            raise

    def garantir_filial_existe(self, nome="Cidade Teste Selenium"):
        self.driver.get(f"{self.base_url}/filiais")
        
        try:
            filiais_rows = self.driver.find_elements(By.CSS_SELECTOR, "tbody tr")
            if len(filiais_rows) > 0:
                return
        except:
            pass
        
        try:
            nova_filial_btn = self.esperar_clicavel(By.XPATH, "//a[contains(text(), 'Nova Filial')]", timeout=3)
            nova_filial_btn.click()
            
            cidade_input = self.esperar_elemento(By.NAME, "nome_cidade", timeout=3)
            cidade_input.clear()
            cidade_input.send_keys(nome)
            
            empresa_select = self.driver.find_element(By.NAME, "empresa")
            empresa_select.click()
            primeira_empresa = self.driver.find_element(By.CSS_SELECTOR, "select[name='empresa'] option:nth-child(2)")
            primeira_empresa.click()
            
            salvar_btn = self.esperar_clicavel(By.XPATH, "//button[contains(text(), 'Salvar')]", timeout=3)
            salvar_btn.click()
            
            self.esperar_texto(By.TAG_NAME, "body", nome, timeout=3)
        except Exception as e:
            raise

    def testar_filial_crud(self):
        self.garantir_empresa_existe()
        self.driver.get(f"{self.base_url}/filiais")
        time.sleep(1)
        
        self.close_any_open_modals()
        
        try:
            nova_filial_btn = self.esperar_clicavel(By.XPATH, "//a[contains(text(), 'Nova Filial')]", timeout=3)
            nova_filial_btn.click()
        except Exception as e:
            raise
        
        try:
            cidade_input = self.esperar_elemento(By.NAME, "nome_cidade", timeout=3)
            cidade_input.clear()
            cidade_input.send_keys("Cidade Teste Selenium")
            
            empresa_select = self.driver.find_element(By.NAME, "empresa")
            empresa_select.click()
            primeira_empresa = self.driver.find_element(By.CSS_SELECTOR, "select[name='empresa'] option:nth-child(2)")
            primeira_empresa.click()
        except Exception as e:
            raise
        
        try:
            salvar_btn = self.esperar_clicavel(By.XPATH, "//button[contains(text(), 'Salvar')]", timeout=3)
            salvar_btn.click()
        except Exception as e:
            raise
        
        try:
            self.esperar_elemento(By.XPATH, "//h2[contains(text(), 'Gestão de Filiais')]", timeout=3)
        except Exception as e:
            raise
        
        try:
            self.esperar_texto(By.TAG_NAME, "body", "Cidade Teste Selenium", timeout=3)
        except Exception as e:
            raise
        
        try:
            filial_row = self.driver.find_element(By.XPATH, f"//td[contains(text(), 'Cidade Teste Selenium')]/..")
            filial_id = filial_row.get_attribute("id").replace("filial-row-", "")
            
            edit_btn = self.esperar_clicavel(By.ID, f"edit-filial-{filial_id}", timeout=3)
            edit_btn.click()
        except Exception as e:
            raise
        
        try:
            cidade_input = self.esperar_elemento(By.NAME, "nome_cidade", timeout=3)
            cidade_input.clear()
            cidade_input.send_keys("Cidade Teste Editada")
            
            empresa_select = self.driver.find_element(By.NAME, "empresa")
            empresa_select.click()
            primeira_empresa = self.driver.find_element(By.CSS_SELECTOR, "select[name='empresa'] option:nth-child(2)")
            primeira_empresa.click()
        except Exception as e:
            raise
        
        try:
            salvar_btn = self.esperar_clicavel(By.XPATH, "//button[contains(text(), 'Salvar')]", timeout=3)
            salvar_btn.click()
        except Exception as e:
            raise
        
        try:
            self.esperar_elemento(By.XPATH, "//h2[contains(text(), 'Gestão de Filiais')]", timeout=3)
        except Exception as e:
            raise
        
        try:
            self.esperar_texto(By.TAG_NAME, "body", "Cidade Teste Editada", timeout=3)
        except Exception as e:
            raise
        
        try:
            filial_row = self.driver.find_element(By.XPATH, f"//td[contains(text(), 'Cidade Teste Editada')]/..")
            filial_id = filial_row.get_attribute("id").replace("filial-row-", "")
            
            delete_btn = self.esperar_clicavel(By.ID, f"delete-filial-{filial_id}", timeout=3)
            delete_btn.click()
        except Exception as e:
            raise
        
        try:
            self.esperar_elemento(By.CLASS_NAME, "modal-content", timeout=3)
            
            confirm_selectors = [
                "//button[contains(text(), 'Confirmar')]",
                "//button[text()='Confirmar']",
                "//div[@class='modal-footer']//button[contains(text(), 'Confirmar')]",
                "//div[@class='modal-footer']//button[text()='Confirmar']"
            ]
            
            confirm_btn = None
            for selector in confirm_selectors:
                try:
                    confirm_btn = self.esperar_clicavel(By.XPATH, selector, timeout=5)
                    break
                except:
                    continue
            
            if not confirm_btn:
                raise Exception("Não conseguiu encontrar botão Confirmar")
                
            confirm_btn.click()
            time.sleep(1)
        except Exception as e:
            raise
        
        try:
            body_text = self.driver.find_element(By.TAG_NAME, "body").text
            assert "Cidade Teste Editada" not in body_text
        except Exception as e:
            raise

    def testar_produto_crud(self):
        self.garantir_empresa_existe()
        self.garantir_filial_existe()
        self.driver.get(f"{self.base_url}/produtos")
        time.sleep(1)
        
        self.close_any_open_modals()
        
        try:
            from selenium.webdriver.support.ui import Select
            categoria_select = self.esperar_elemento(By.CSS_SELECTOR, "select.form-select", timeout=3)
            select = Select(categoria_select)
            select.select_by_visible_text("Alimentação")
            time.sleep(1)
        except Exception as e:
            raise
        
        try:
            cadastrar_btn = self.esperar_clicavel(By.XPATH, "//button[contains(text(), 'Cadastrar')]", timeout=3)
            cadastrar_btn.click()
        except Exception as e:
            raise
        
        try:
            nome_input = self.esperar_elemento(By.NAME, "nome", timeout=3)
            nome_input.clear()
            nome_input.send_keys("Produto Teste Selenium")
            time.sleep(1)
            
            preco_input = self.driver.find_element(By.NAME, "preco")
            preco_input.clear()
            preco_input.send_keys("10.50")
            time.sleep(1)
            
            quantidade_input = self.driver.find_element(By.NAME, "quant")
            quantidade_input.clear()
            quantidade_input.send_keys("100")
            time.sleep(1)
            
            descricao_input = self.driver.find_element(By.NAME, "descricao")
            descricao_input.clear()
            descricao_input.send_keys("Descrição do produto teste")
            time.sleep(1)
            
            peso_input = self.driver.find_element(By.NAME, "peso")
            peso_input.clear()
            peso_input.send_keys("0.5")
            time.sleep(1)
            
            vegetariano_checkbox = self.driver.find_element(By.NAME, "vegetariano")
            
            filial_select = self.driver.find_element(By.NAME, "filial")
            filial_select.click()
            time.sleep(1)
            primeira_filial = self.driver.find_element(By.CSS_SELECTOR, "select[name='filial'] option:nth-child(2)")
            primeira_filial.click()
            time.sleep(1)
            
            nome_val = self.driver.find_element(By.NAME, "nome").get_attribute("value")
            preco_val = self.driver.find_element(By.NAME, "preco").get_attribute("value")
            quant_val = self.driver.find_element(By.NAME, "quant").get_attribute("value")
            peso_val = self.driver.find_element(By.NAME, "peso").get_attribute("value")
            filial_val = self.driver.find_element(By.NAME, "filial").get_attribute("value")
            vegetariano_val = self.driver.find_element(By.NAME, "vegetariano").is_selected()
        except Exception as e:
            raise
        
        try:
            salvar_btn = self.esperar_clicavel(By.XPATH, "//button[contains(text(), 'Salvar')]", timeout=3)
            salvar_btn.click()
            time.sleep(1)
            
            try:
                alert = self.driver.switch_to.alert
                alert_text = alert.text
                alert.accept()
                time.sleep(1)
                
                if "Erro" in alert_text:
                    raise Exception(f"Erro ao salvar produto: {alert_text}")
            except:
                pass
                
        except Exception as e:
            raise
        
        try:
            self.esperar_elemento(By.XPATH, "//h2[contains(text(), 'Produtos')]", timeout=3)
            time.sleep(1)
        except Exception as e:
            raise
        
        try:
            self.esperar_texto(By.TAG_NAME, "body", "Produto Teste Selenium", timeout=3)
            body_text = self.driver.find_element(By.TAG_NAME, "body").text
            time.sleep(1)
        except Exception as e:
            raise
        
        try:
            produto_row = self.driver.find_element(By.XPATH, f"//td[contains(text(), 'Produto Teste Selenium')]/..")
            produto_id = produto_row.get_attribute("id").replace("produto-row-", "")
            
            edit_btn = self.esperar_clicavel(By.ID, f"edit-produto-{produto_id}", timeout=3)
            
            self.driver.execute_script("arguments[0].scrollIntoView(true);", edit_btn)
            time.sleep(1)
            
            edit_btn.click()
        except Exception as e:
            raise
        
        try:
            nome_input = self.esperar_elemento(By.NAME, "nome", timeout=3)
            nome_input.clear()
            nome_input.send_keys("Produto Teste Editado")
            time.sleep(1)
            
            preco_input = self.driver.find_element(By.NAME, "preco")
            preco_input.clear()
            preco_input.send_keys("15.75")
            time.sleep(1)
            
            quantidade_input = self.driver.find_element(By.NAME, "quant")
            quantidade_input.clear()
            quantidade_input.send_keys("50")
            time.sleep(1)
            
            descricao_input = self.driver.find_element(By.NAME, "descricao")
            descricao_input.clear()
            descricao_input.send_keys("Descrição do produto editado")
            time.sleep(1)
            
            peso_input = self.driver.find_element(By.NAME, "peso")
            peso_input.clear()
            peso_input.send_keys("1.0")
            time.sleep(1)
            
            vegetariano_checkbox = self.driver.find_element(By.NAME, "vegetariano")
            if not vegetariano_checkbox.is_selected():
                vegetariano_checkbox.click()
                time.sleep(1)
        except Exception as e:
            raise
        
        try:
            salvar_btn = self.esperar_clicavel(By.XPATH, "//button[contains(text(), 'Salvar')]", timeout=3)
            salvar_btn.click()
            time.sleep(1)
            
            try:
                alert = self.driver.switch_to.alert
                alert_text = alert.text
                alert.accept()
                time.sleep(1)
                
                if "Erro" in alert_text:
                    raise Exception(f"Erro ao editar produto: {alert_text}")
            except:
                pass
                
        except Exception as e:
            raise
        
        try:
            self.esperar_elemento(By.XPATH, "//h2[contains(text(), 'Produtos')]", timeout=3)
            time.sleep(1)
        except Exception as e:
            raise
        
        try:
            self.esperar_texto(By.TAG_NAME, "body", "Produto Teste Editado", timeout=3)
        except Exception as e:
            raise
        
        try:
            produto_row = self.driver.find_element(By.XPATH, f"//td[contains(text(), 'Produto Teste Editado')]/..")
            produto_id = produto_row.get_attribute("id").replace("produto-row-", "")
            
            delete_btn = self.esperar_clicavel(By.ID, f"delete-produto-{produto_id}", timeout=3)
            
            self.driver.execute_script("arguments[0].scrollIntoView(true);", delete_btn)
            time.sleep(1)
            
            delete_btn.click()
            time.sleep(1)
        except Exception as e:
            raise
        
        try:
            self.esperar_elemento(By.CLASS_NAME, "modal-content", timeout=3)
            time.sleep(1)
            
            confirm_selectors = [
                "//button[contains(text(), 'Confirmar')]",
                "//button[text()='Confirmar']",
                "//div[@class='modal-footer']//button[contains(text(), 'Confirmar')]",
                "//div[@class='modal-footer']//button[text()='Confirmar']"
            ]
            
            confirm_btn = None
            for selector in confirm_selectors:
                try:
                    confirm_btn = self.esperar_clicavel(By.XPATH, selector, timeout=5)
                    break
                except:
                    continue
            
            if not confirm_btn:
                raise Exception("Não conseguiu encontrar botão Confirmar")
                
            confirm_btn.click()
            time.sleep(1)
        except Exception as e:
            raise
        
        try:
            body_text = self.driver.find_element(By.TAG_NAME, "body").text
            assert "Produto Teste Editado" not in body_text
        except Exception as e:
            raise

    def testar_visualizacao_produto(self):
        self.garantir_empresa_existe()
        self.garantir_filial_existe()
        self.driver.get(f"{self.base_url}/produtos")
        time.sleep(1)
        
        self.close_any_open_modals()
        
        try:
            from selenium.webdriver.support.ui import Select
            categoria_select = self.esperar_elemento(By.CSS_SELECTOR, "select.form-select", timeout=3)
            select = Select(categoria_select)
            select.select_by_visible_text("Alimentação")
            time.sleep(1)
        except Exception as e:
            raise
        
        try:
            cadastrar_btn = self.esperar_clicavel(By.XPATH, "//button[contains(text(), 'Cadastrar')]", timeout=3)
            cadastrar_btn.click()
        except Exception as e:
            raise
        
        try:
            nome_input = self.esperar_elemento(By.NAME, "nome", timeout=3)
            nome_input.clear()
            nome_input.send_keys("Produto Para Visualizar")
            time.sleep(1)
            
            preco_input = self.driver.find_element(By.NAME, "preco")
            preco_input.clear()
            preco_input.send_keys("25.90")
            time.sleep(1)
            
            quantidade_input = self.driver.find_element(By.NAME, "quant")
            quantidade_input.clear()
            quantidade_input.send_keys("75")
            time.sleep(1)
            
            descricao_input = self.driver.find_element(By.NAME, "descricao")
            descricao_input.clear()
            descricao_input.send_keys("Produto criado para teste de visualização")
            time.sleep(1)
            
            peso_input = self.driver.find_element(By.NAME, "peso")
            peso_input.clear()
            peso_input.send_keys("2.5")
            time.sleep(1)
            
            vegetariano_checkbox = self.driver.find_element(By.NAME, "vegetariano")
            vegetariano_checkbox.click()
            time.sleep(1)
            
            filial_select = self.driver.find_element(By.NAME, "filial")
            filial_select.click()
            time.sleep(1)
            primeira_filial = self.driver.find_element(By.CSS_SELECTOR, "select[name='filial'] option:nth-child(2)")
            primeira_filial.click()
            time.sleep(1)
        except Exception as e:
            raise
        
        try:
            salvar_btn = self.esperar_clicavel(By.XPATH, "//button[contains(text(), 'Salvar')]", timeout=3)
            salvar_btn.click()
            time.sleep(1)
        except Exception as e:
            raise
        
        try:
            self.esperar_elemento(By.XPATH, "//h2[contains(text(), 'Produtos')]", timeout=3)
            time.sleep(1)
        except Exception as e:
            raise
        
        try:
            self.esperar_texto(By.TAG_NAME, "body", "Produto Para Visualizar", timeout=3)
        except Exception as e:
            raise
        
        try:
            produto_row = self.driver.find_element(By.XPATH, f"//td[contains(text(), 'Produto Para Visualizar')]/..")
            produto_id = produto_row.get_attribute("id").replace("produto-row-", "")
            
            view_btn = self.esperar_clicavel(By.ID, f"view-produto-{produto_id}", timeout=3)
            
            self.driver.execute_script("arguments[0].scrollIntoView(true);", view_btn)
            time.sleep(1)
            
            view_btn.click()
        except Exception as e:
            raise
        
        try:
            self.esperar_elemento(By.XPATH, f"//h2[contains(text(), 'Produto Para Visualizar')]", timeout=5)
            time.sleep(1)
        except Exception as e:
            raise
        
        try:
            self.esperar_texto(By.TAG_NAME, "body", "Produto Para Visualizar", timeout=3)
            
            self.esperar_texto(By.TAG_NAME, "body", "25.90", timeout=3)
            
            self.esperar_texto(By.TAG_NAME, "body", "75", timeout=3)
            
            self.esperar_texto(By.TAG_NAME, "body", "2.5", timeout=3)
            
        except Exception as e:
            raise
        
        try:
            voltar_btn = self.esperar_clicavel(By.XPATH, "//button[contains(text(), 'Voltar')]", timeout=3)
            voltar_btn.click()
            time.sleep(1)
        except Exception as e:
            raise
        
        try:
            self.esperar_elemento(By.XPATH, "//h2[contains(text(), 'Produtos')]", timeout=3)
        except Exception as e:
            raise
        
        try:
            produto_row = self.driver.find_element(By.XPATH, f"//td[contains(text(), 'Produto Para Visualizar')]/..")
            produto_id = produto_row.get_attribute("id").replace("produto-row-", "")
            
            delete_btn = self.esperar_clicavel(By.ID, f"delete-produto-{produto_id}", timeout=3)
            
            self.driver.execute_script("arguments[0].scrollIntoView(true);", delete_btn)
            time.sleep(1)
            
            delete_btn.click()
            time.sleep(1)
        except Exception as e:
            raise
        
        try:
            self.esperar_elemento(By.CLASS_NAME, "modal-content", timeout=3)
            time.sleep(1)
            
            confirm_selectors = [
                "//button[contains(text(), 'Confirmar')]",
                "//button[text()='Confirmar']",
                "//div[@class='modal-footer']//button[contains(text(), 'Confirmar')]",
                "//div[@class='modal-footer']//button[text()='Confirmar']"
            ]
            
            confirm_btn = None
            for selector in confirm_selectors:
                try:
                    confirm_btn = self.esperar_clicavel(By.XPATH, selector, timeout=5)
                    break
                except:
                    continue
            
            if not confirm_btn:
                raise Exception("Não conseguiu encontrar botão Confirmar")
                
            confirm_btn.click()
            time.sleep(1)
        except Exception as e:
            raise
        
        try:
            body_text = self.driver.find_element(By.TAG_NAME, "body").text
            assert "Produto Para Visualizar" not in body_text
        except Exception as e:
            raise


if __name__ == "__main__":
    unittest.main() 