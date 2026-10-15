import json
from pathlib import Path
import sys
import tempfile
import unittest
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from dispatch import load_task, make_command, build_prompt

class TestDispatcher(unittest.TestCase):
    def task(self):
        return {"id":"AION-001","status":"READY","risk":"LOW",
                "engine":"antigravity","objective":"Read repository only.",
                "allowed_paths":["orchestration/"],
                "acceptance_criteria":["Return a report."],
                "constraints":[]}
    def parse(self, obj):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "task.json"
            path.write_text(json.dumps(obj), encoding="utf-8")
            return load_task(path)
    def test_valid(self):
        self.assertEqual(self.parse(self.task())["id"], "AION-001")
    def test_no_parent_traversal(self):
        task=self.task(); task["allowed_paths"]=["../secret"]
        with self.assertRaises(ValueError): self.parse(task)
    def test_empty_scope(self):
        task=self.task(); task["allowed_paths"]=[]
        with self.assertRaises(ValueError): self.parse(task)
    def test_prompt_rules(self):
        p=build_prompt(self.task(),"antigravity")
        self.assertIn("AGENTS.md",p)
        self.assertIn("Return a report.",p)
    def test_cli_flags(self):
        cmd=make_command("antigravity","hello",Path("/workspace"),20)
        self.assertEqual(cmd[:2],["agy","-p"])
        self.assertIn("--sandbox",cmd)
        self.assertNotIn("--dangerously-skip-permissions",cmd)
    def test_codex_flags(self):
        cmd=make_command("codex","hello",Path("/workspace"),20)
        self.assertEqual(cmd[:2],["codex","exec"])
        self.assertIn("workspace-write",cmd)
if __name__=="__main__": unittest.main()
