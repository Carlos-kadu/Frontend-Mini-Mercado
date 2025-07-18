import os
import sys
import subprocess
import argparse
from pathlib import Path


def run_tests_local():
    cmd = [
        sys.executable, "-m", "pytest",
        "test_navigation.py",
        "test_crud_operations.py",
        "-v"
    ]
    
    result = subprocess.run(cmd)
    return result.returncode


def run_tests_docker():
    env = os.environ.copy()
    env['DOCKER_ENV'] = 'true'
    
    cmd = [
        sys.executable, "-m", "pytest",
        "test_navigation.py",
        "test_crud_operations.py",
        "-v"
    ]
    
    result = subprocess.run(cmd, env=env)
    return result.returncode


def run_specific_test(test_file):    
    cmd = [
        sys.executable, "-m", "pytest",
        test_file,
        "-v"
    ]
    
    result = subprocess.run(cmd)
    return result.returncode


def main():
    parser = argparse.ArgumentParser(description="Executar testes Selenium")
    parser.add_argument(
        "--mode",
        choices=["local", "docker", "both"],
        default="local",
        help="Modo de execução (local, docker, both)"
    )
    parser.add_argument(
        "--test",
        help="Arquivo de teste específico para executar"
    )
    
    args = parser.parse_args()
    
    test_dir = Path(__file__).parent
    os.chdir(test_dir)
    
    if args.test:
        return run_specific_test(args.test)
    
    if args.mode == "local":
        return run_tests_local()
    elif args.mode == "docker":
        return run_tests_docker()
    elif args.mode == "both":
        local_result = run_tests_local()
        docker_result = run_tests_docker()
        return 0 if local_result == 0 and docker_result == 0 else 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code) 