import { useState } from 'react';
import { Search, Check, Plus, ChevronDown, Folder } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Input } from './ui/input';
import { cn } from './ui/utils';

interface Project {
  id: string;
  name: string;
  icon?: string;
}

interface ProjectSwitcherProps {
  projects?: Project[];
  currentProjectId?: string;
  onProjectChange?: (projectId: string) => void;
  onCreateProject?: () => void;
}

// 默认数据
const defaultProjects: Project[] = [
  {
    id: '1',
    name: 'BPMSTEST',
  },
  {
    id: '2',
    name: '项目A',
  },
  {
    id: '3',
    name: '项目B',
  },
];

export function ProjectSwitcher({
  projects = defaultProjects,
  currentProjectId,
  onProjectChange,
  onCreateProject,
}: ProjectSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [projectSearch, setProjectSearch] = useState('');

  // 如果没有指定当前项目，使用第一个
  const activeProjectId = currentProjectId || projects[0]?.id || '';
  const currentProject = projects.find(p => p.id === activeProjectId);

  // 过滤项目
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const handleProjectSelect = (projectId: string) => {
    if (onProjectChange) {
      onProjectChange(projectId);
    }
    setOpen(false);
  };

  // 项目图标组件
  const ProjectIcon = ({ project }: { project: Project }) => {
    if (project.icon) {
      return <span className="text-xs">{project.icon}</span>;
    }
    // 默认黑色文件夹图标
    return (
      <div className="w-5 h-5 flex items-center justify-center">
        <Folder className="w-4 h-4 text-foreground" />
      </div>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-accent transition-colors text-sm"
        >
          <div className="flex items-center gap-2">
            <ProjectIcon project={currentProject || projects[0]} />
            <span className="text-foreground">{currentProject?.name || '选择项目'}</span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[300px] p-0 shadow-lg"
        sideOffset={8}
      >
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Find Project..."
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        </div>
        <div className="p-2 max-h-[400px] overflow-y-auto">
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Projects
          </div>
          <div className="space-y-0.5">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleProjectSelect(project.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-2 py-2 rounded-sm text-sm transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    activeProjectId === project.id && 'bg-accent text-accent-foreground'
                  )}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <ProjectIcon project={project} />
                    <span className="truncate">{project.name}</span>
                  </div>
                  {activeProjectId === project.id && (
                    <Check className="w-4 h-4 shrink-0 text-foreground" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                暂无项目
              </div>
            )}
          </div>
          {onCreateProject && (
            <button
              onClick={() => {
                onCreateProject();
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-sm text-sm text-primary hover:bg-accent transition-colors mt-1"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

